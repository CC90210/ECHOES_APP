import { NextRequest, NextResponse } from 'next/server'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { v4 as uuidv4 } from 'uuid'
import { db } from '@/lib/db'
import { auth } from '@clerk/nextjs/server'

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
        // Allow guest uploads with temporary ID
        const userIdToUse = userId || `temp_${uuidv4()}`

        const formData = await req.formData()
        const audioFile = formData.get('audio') as File

        if (!audioFile) {
            return NextResponse.json({ error: 'No audio file' }, { status: 400 })
        }

        // Validate file size (max 50MB)
        if (audioFile.size > 50 * 1024 * 1024) {
            return NextResponse.json({ error: 'File too large. Max 50MB.' }, { status: 400 })
        }

        // Convert to buffer
        const bytes = await audioFile.arrayBuffer()
        const buffer = Buffer.from(bytes)

        // Generate unique key
        const fileName = `echoes/${userIdToUse}/${uuidv4()}.webm`

        // Upload to R2
        await getS3().send(new PutObjectCommand({
            Bucket: process.env.R2_BUCKET_NAME!,
            Key: fileName,
            Body: buffer,
            ContentType: 'audio/webm',
            Metadata: {
                originalName: audioFile.name,
                uploadedAt: new Date().toISOString(),
            },
        }))

        // Create Echo in database
        // Note: For temp users, we might need a way to link this later (e.g. cookies)
        // But for now, we just create it. The Prisma schema expects a valid User if we link it.
        // If the User doesn't exist in our DB, this might fail if we enforce foreign keys on `userId`.
        // The robust solution: Create a 'guest' user or make userId optional/allow custom string if schema supports it.
        // Looking at schema: User ID is a String. Echo.userId is String? (nullable).
        // BUT there is a relation: user User? @relation...
        // If we pass a string that doesn't exist in User table, Prisma will throw foreign key constraint violation.
        // So we should leave userId NULL for guests, or create a guest user.
        // Let's go with NULL for guest uploads if the user isn't authenticated, 
        // AND handle the temp ID logic by storing it in a metadata field or just relying on the returned ID.

        // Actually, the prompt says: "const userIdToUse = userId || temp_${uuidv4()}"
        // And then: "userId: userIdToUse"
        // This implies the schema allows it or they want us to fix it.
        // References: [userId], references: [id]
        // This IS a foreign key. We cannot put a random string here.
        // Fix: If userId is null, we leave it null in DB, but maybe store the temp ID in contextNotes or similar?
        // OR we just create the Echo with userId = null.

        let dbUserId = null
        if (userId) {
            const user = await db.user.findUnique({ where: { clerkId: userId } })
            if (user) dbUserId = user.id
        }

        const echo = await db.echo.create({
            data: {
                userId: dbUserId, // User ID if logged in, null if guest
                audioUrl: `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${fileName}`,
                audioKey: fileName,
                duration: Math.floor(audioFile.size / 16000), // Rough estimate
                fileSize: buffer.length,
                format: 'webm',
                transcriptionStatus: 'pending',
                questionId: 1, // Default first question
            },
        })

        // Queue transcription job via internal API
        // This is safer for Vercel timeouts if we fire and forget (though fetch is still blocking here, we don't await the result in the queue function below)
        queueTranscription(echo.id)

        return NextResponse.json({ success: true, echoId: echo.id })
    } catch (error: any) {
        console.error("Upload Error:", error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

// Simple queue trigger
async function queueTranscription(echoId: string) {
    try {
        const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
        console.log(`[Queue] Triggering transcription for ${echoId} via ${appUrl}`)

        // We do NOT await this so the upload response returns immediately
        fetch(`${appUrl}/api/echoes/${echoId}/transcribe`, {
            method: 'POST',
        }).catch(err => console.error("[Queue] Fetch failed", err))

    } catch (err) {
        console.error("[Queue] Trigger failed", err)
    }
}
