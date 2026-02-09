import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3'
import { db } from '@/lib/db'

const getOpenAI = () => {
    if (!process.env.OPENAI_API_KEY) throw new Error("OpenAI API Key missing")
    return new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
}

const getS3 = () => {
    if (!process.env.R2_ACCOUNT_ID || !process.env.R2_ACCESS_KEY_ID || !process.env.R2_SECRET_ACCESS_KEY) {
        throw new Error("R2 keys missing")
    }
    return new S3Client({
        region: 'auto',
        endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
        credentials: {
            accessKeyId: process.env.R2_ACCESS_KEY_ID!,
            secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
        },
    })
}

export async function POST(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    const echoId = params.id
    console.log(`[Transcription Route] Starting for Echo: ${echoId}`)

    try {
        const echo = await db.echo.findUnique({
            where: { id: echoId },
        })

        if (!echo) {
            return NextResponse.json({ error: 'Echo not found' }, { status: 404 })
        }

        if (echo.transcriptionStatus === 'completed') {
            return NextResponse.json({ success: true, message: "Already transcribed" })
        }

        await db.echo.update({
            where: { id: echoId },
            data: { transcriptionStatus: 'processing' },
        })

        // Download from R2
        const { Body } = await getS3().send(
            new GetObjectCommand({
                Bucket: process.env.R2_BUCKET_NAME!,
                Key: echo.audioKey,
            })
        )

        if (!Body) throw new Error('Failed to download from R2')

        const chunks: Uint8Array[] = []
        for await (const chunk of Body as any) {
            chunks.push(chunk)
        }
        const audioBuffer = Buffer.concat(chunks)

        // Transcription with Whisper
        const audioFile = new File([audioBuffer], `echo.${echo.format}`, {
            type: `audio/${echo.format}`,
        })

        const transcription = await getOpenAI().audio.transcriptions.create({
            file: audioFile,
            model: 'whisper-1',
            response_format: 'verbose_json',
        })

        // AI Analysis
        const analysis = await getOpenAI().chat.completions.create({
            model: 'gpt-4o',
            messages: [
                {
                    role: 'system',
                    content: `You are analyzing a voice recording transcription for an intergenerational legacy platform.
          
Provide analysis in this exact JSON format:
{
  "emotionalTone": "single word describing primary emotion (e.g., reflective, nostalgic)",
  "themes": ["theme1", "theme2", "theme3"],
  "summary": "2-3 sentence summary",
  "insights": ["key insight 1", "key insight 2"]
}`,
                },
                {
                    role: 'user',
                    content: `Transcription: "${transcription.text}"`,
                },
            ],
            response_format: { type: 'json_object' },
        })

        const result = JSON.parse(analysis.choices[0].message.content || '{}')

        // Create Voice Profile (Digital Immortality)
        const words = transcription.text.split(/\s+/).filter(w => w.length > 0)
        const avgWordLength = words.reduce((sum, w) => sum + w.length, 0) / (words.length || 1)
        const sentences = transcription.text.split(/[.!?]+/).filter(s => s.trim().length > 0)
        const avgSentenceLength = words.length / (sentences.length || 1)

        const voiceMetrics = {
            avgWordLength,
            avgSentenceLength,
            vocabularyComplexity: avgWordLength > 5 ? 'high' : 'moderate',
            speakingStyle: avgSentenceLength > 15 ? 'elaborate' : 'concise',
        }

        await db.echo.update({
            where: { id: echoId },
            data: {
                transcription: transcription.text,
                transcriptionStatus: 'completed',
                duration: Math.round(transcription.duration || echo.duration),
                emotionalTone: result.emotionalTone || 'reflective',
                themes: result.themes || [],
                aiSummary: result.summary || '',
                voice_profile_data: voiceMetrics
            },
        })

        return NextResponse.json({ success: true, transcription: transcription.text })

    } catch (error: any) {
        console.error('[Transcription Error]', error)
        await db.echo.update({
            where: { id: echoId },
            data: { transcriptionStatus: 'failed' },
        })
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
