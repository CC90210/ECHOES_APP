import { NextRequest, NextResponse } from 'next/server'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { v4 as uuidv4 } from 'uuid'
import { db } from '@/lib/db'
import { auth } from '@clerk/nextjs/server'
import { queueTranscription } from '@/lib/transcribe'

const getS3 = () => {
    if (!process.env.R2_ACCOUNT_ID || !process.env.R2_ACCESS_KEY_ID || !process.env.R2_SECRET_ACCESS_KEY) {
        throw new Error("R2 Storage misconfigured: Missing keys")
    }
    return new S3Client({
        region: 'auto',
        endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
        credentials: {
            accessKeyId: process.env.R2_ACCESS_KEY_ID,
            secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
        },
    })
}

export async function POST(req: NextRequest) {
    try {
        const { userId } = await auth()

        const formData = await req.formData()
        const audioFile = formData.get('audio') as File

        if (!audioFile) {
            return NextResponse.json({ error: 'No audio file' }, { status: 400 })
        }

        // Convert to buffer
        const bytes = await audioFile.arrayBuffer()
        const buffer = Buffer.from(bytes)

        // Generate unique key
        const fileName = `echoes/${uuidv4()}.webm`

        // Upload to R2
        await getS3().send(new PutObjectCommand({
            Bucket: process.env.R2_BUCKET_NAME!,
            Key: fileName,
            Body: buffer,
            ContentType: 'audio/webm',
        }))

        // If user is signed in, find or create them in DB
        let dbUserId = null
        if (userId) {
            const user = await db.user.findUnique({
                where: { clerkId: userId }
            })
            if (user) {
                dbUserId = user.id
            }
            // In production, we'd handle User creation via webhooks or upfront
        }

        // Create Echo in database
        const echo = await db.echo.create({
            data: {
                userId: dbUserId,
                audioUrl: `${process.env.R2_PUBLIC_URL}/${fileName}`,
                audioKey: fileName,
                duration: 0, // In production, calculate from blob or pass from client
                fileSize: buffer.length,
                format: 'webm',
                transcriptionStatus: 'pending',
            },
        })

        // Queue transcription job
        await queueTranscription(echo.id)

        return NextResponse.json({ echoId: echo.id })
    } catch (error: any) {
        console.error("Upload Error:", error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
