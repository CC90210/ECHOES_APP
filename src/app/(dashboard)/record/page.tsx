'use client'

import { AudioRecorder } from "@/components/recorder/AudioRecorder"
import { useRouter } from "next/navigation"

export default function RecordPage() {
    const router = useRouter()

    const handleComplete = (echo: any) => {
        // Redirect to vault or single echo page after saving
        router.push('/vault')
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-8">
            <div className="text-center space-y-2">
                <h1 className="text-4xl font-black text-neutral-900 tracking-tight">Record an Echo</h1>
                <p className="text-neutral-500 text-lg">Leave a message for the people who matter most.</p>
            </div>

            <div className="w-full">
                <AudioRecorder onComplete={handleComplete} />
            </div>

            {/* Instructions / Tips */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-2xl mt-12">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100">
                    <h4 className="font-bold text-neutral-900 mb-2">Be Authentic</h4>
                    <p className="text-sm text-neutral-500">Don't worry about being perfect. Your real voice and natural pauses are what they'll love most.</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100">
                    <h4 className="font-bold text-neutral-900 mb-2">Eliminate Noise</h4>
                    <p className="text-sm text-neutral-500">Find a quiet space where you won't be interrupted for the next few minutes.</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100">
                    <h4 className="font-bold text-neutral-900 mb-2">Take Your Time</h4>
                    <p className="text-sm text-neutral-500">There's no rush. You can pause the recording at any time to gather your thoughts.</p>
                </div>
            </div>
        </div>
    )
}
