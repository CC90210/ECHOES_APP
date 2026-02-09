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
    try {
        console.log(`Analyzing echo: ${echoId}`)
        const analysis = await getOpenAI().chat.completions.create({
            model: 'gpt-4o',
            messages: [
                {
                    role: 'system',
                    content: `You are analyzing a voice recording transcription for an intergenerational legacy platform called ECHOES.
          
Provide analysis in this exact JSON format:
{
  "emotionalTone": "single word describing primary emotion (e.g., reflective, hopeful, nostalgic, anxious)",
  "themes": ["theme1", "theme2", "theme3"],
  "summary": "2-3 sentence summary of the core message",
  "insights": ["key insight 1", "key insight 2", "key insight 3"]
}`,
                },
                {
                    role: 'user',
                    content: `Transcription: "${transcription}"`,
                },
            ],
            response_format: { type: 'json_object' },
        })

        const result = JSON.parse(analysis.choices[0].message.content || '{}')

        await db.echo.update({
            where: { id: echoId },
            data: {
                aiSummary: result.summary || '',
                emotionalTone: result.emotionalTone || 'Reflective',
                themes: result.themes || ['legacy'],
            },
        })

        // Create voice profile metrics for Digital Immortality
        await createVoiceProfile(echoId, transcription)
    } catch (error) {
        console.error("Analysis Error:", error)
    }
}

async function createVoiceProfile(echoId: string, transcription: string) {
    try {
        const words = transcription.split(/\s+/).filter(w => w.length > 0)
        if (words.length === 0) return

        const avgWordLength = words.reduce((sum, w) => sum + w.length, 0) / words.length
        const sentences = transcription.split(/[.!?]+/).filter(s => s.trim().length > 0)
        const avgSentenceLength = words.length / (sentences.length || 1)

        const voiceMetrics = {
            avgWordLength: Number(avgWordLength.toFixed(2)),
            avgSentenceLength: Number(avgSentenceLength.toFixed(2)),
            vocabularyComplexity: avgWordLength > 5 ? 'high' : 'moderate',
            speakingStyle: avgSentenceLength > 15 ? 'elaborate' : 'concise',
            timestamp: new Date().toISOString()
        }

        await db.echo.update({
            where: { id: echoId },
            data: {
                voice_profile_data: voiceMetrics
            }
        })
    } catch (err) {
        console.error("Voice Profile Error:", err)
    }
}

// Simple queue (Background execution)
export async function queueTranscription(echoId: string) {
    console.log(`Queuing transcription for Echo ${echoId}`)
    transcribeEcho(echoId).catch(err => console.error("Async Transcription failed", err))
}
