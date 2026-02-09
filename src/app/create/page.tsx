'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { Loader2 } from 'lucide-react'

// Dynamically import Recorder with no SSR to prevent WaveSurfer window errors
const Recorder = dynamic(() => import('@/components/Recorder'), {
    ssr: false,
    loading: () => (
        <div className="flex items-center justify-center p-12">
            <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
        </div>
    )
})

export default function CreateEchoPage() {
    const [started, setStarted] = useState(false)

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-purple-900/50 py-12 px-6 flex items-center justify-center">
            <div className="max-w-3xl w-full">
                {!started ? (
                    <div className="text-center space-y-8 max-w-2xl mx-auto">
                        <h1 className="text-5xl font-black text-white leading-tight">
                            What do you want your great-grandchildren to know about <span className="text-purple-400">you</span>?
                        </h1>
                        <p className="text-xl text-gray-400">Your voice is a bridge across time. Start your legacy today.</p>
                        <button
                            onClick={() => setStarted(true)}
                            className="px-10 py-5 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xl font-bold rounded-full hover:shadow-2xl transition hover:scale-105 active:scale-95"
                        >
                            Start Recording
                        </button>
                    </div>
                ) : (
                    <Recorder />
                )}
            </div>
        </div>
    )
}
