import OpenAI from 'openai'
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3'
import { db } from './db'

const getOpenAI = () => {
    if (!process.env.OPENAI_API_KEY) throw new Error("OpenAI API Key missing")
    return new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
}

const getS3 = () => {
    if (!process.env.R2_ACCESS_KEY_ID || !process.env.R2_SECRET_ACCESS_KEY) throw new Error("R2 keys missing")
    return new S3Client({
        region: 'auto',
        endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
        credentials: {
            accessKeyId: process.env.R2_ACCESS_KEY_ID,
            secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
        },
    })
}

export async function transcribeEcho(echoId: string) {
    try {
        const echo = await db.echo.findUnique({ where: { id: echoId } })
        if (!echo) throw new Error('Echo not found')

        // Download audio from R2
        const { Body } = await getS3().send(new GetObjectCommand({
            Bucket: process.env.R2_BUCKET_NAME!,
            Key: echo.audioKey,
        }))

        if (!Body) throw new Error("Audio body missing from R2")

        const audioBuffer = await Body.transformToByteArray()
        const audioFile = new File([audioBuffer] as any, 'audio.webm', { type: 'audio/webm' })

        // Transcribe with Whisper
        await db.echo.update({
            where: { id: echoId },
            data: { transcriptionStatus: 'processing' },
        })

        const transcription = await getOpenAI().audio.transcriptions.create({
            file: audioFile,
            model: 'whisper-1',
        })

        await db.echo.update({
            where: { id: echoId },
            data: {
                transcription: transcription.text,
                transcriptionStatus: 'completed',
            },
        })

        // Now analyze with GPT-4o
        await analyzeEcho(echoId, transcription.text)
    } catch (error) {
        console.error("Transcription Error:", error)
        await db.echo.update({
            where: { id: echoId },
            data: { transcriptionStatus: 'failed' },
        })
    }
}

async function analyzeEcho(echoId: string, transcription: string) {
    const analysis = await getOpenAI().chat.completions.create({
        model: 'gpt-4o',
        messages: [
            {
                role: 'system',
                content: 'Analyze this voice recording transcription for a legacy platform called ECHOES. Provide: 1) Primary emotional tone (one word), 2) 3-5 key themes (as a list), 3) A 2-sentence summary that captures the essence of the message.',
            },
            {
                role: 'user',
                content: transcription,
            },
        ],
    })

    const result = analysis.choices[0].message.content || ""

    // Simple extraction (Production would use structured output)
    const toneMatch = result.match(/Emotional tone:?\s*(\w+)/i)
    const tone = toneMatch ? toneMatch[1] : 'Reflective'

    const themesMatch = result.match(/Themes:?\s*([\s\S]*?)(?=\n\n|\nSummary|$)/i)
    const themes = themesMatch ? themesMatch[1].split(',').map((t: string) => t.trim().replace(/^-\s*/, '')) : ['legacy']

    const summaryMatch = result.match(/Summary:?\s*([\s\S]*?)$/i)
    const summary = summaryMatch ? summaryMatch[1].trim() : result.slice(0, 500)

    await db.echo.update({
        where: { id: echoId },
        data: {
            aiSummary: summary,
            emotionalTone: tone,
            themes: themes.slice(0, 5),
        },
    })
}

// Simple queue (use Upstash QStash in production)
export async function queueTranscription(echoId: string) {
    // For MVP launch, we call it directly in background (Next.js edges or serverless handles this if we don't await)
    // In production Vercel, this might time out, so QStash is better.
    console.log(`Queuing transcription for Echo ${echoId}`)
    transcribeEcho(echoId).catch(err => console.error("Async Transcription failed", err))
}
