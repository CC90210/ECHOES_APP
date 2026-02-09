'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Mic, Square, Play, Trash2, Loader2, Sparkles } from 'lucide-react'
import WaveSurfer from 'wavesurfer.js'
// @ts-ignore
import RecordPlugin from 'wavesurfer.js/dist/plugins/record.js'

export default function CreateEchoPage() {
    const router = useRouter()
    const [step, setStep] = useState<'question' | 'record' | 'processing'>('question')
    const [isRecording, setIsRecording] = useState(false)
    const [duration, setDuration] = useState(0)
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null)

    const waveformRef = useRef<HTMLDivElement>(null)
    const wavesurfer = useRef<WaveSurfer | null>(null)
    const recordPlugin = useRef<any>(null)
    const timerRef = useRef<NodeJS.Timeout | null>(null)

    useEffect(() => {
        if (!waveformRef.current || step !== 'record') return

        wavesurfer.current = WaveSurfer.create({
            container: waveformRef.current,
            waveColor: 'rgb(168, 85, 247)',
            progressColor: 'rgb(217, 70, 239)',
            height: 100,
            barWidth: 2,
            barGap: 3,
            barRadius: 2,
        })

        recordPlugin.current = wavesurfer.current.registerPlugin(RecordPlugin.create({
            scrollingWaveform: true,
            renderRecordedAudio: true,
        }))

        recordPlugin.current.on('record-end', (blob: Blob) => {
            setAudioBlob(blob)
            setIsRecording(false)
            if (timerRef.current) clearInterval(timerRef.current)
        })

        return () => wavesurfer.current?.destroy()
    }, [step])

    const startRecording = async () => {
        try {
            await recordPlugin.current?.startRecording()
            setIsRecording(true)
            setDuration(0)
            timerRef.current = setInterval(() => setDuration(d => d + 1), 1000)
        } catch (err) {
            console.error("Mic access denied", err)
            alert("Microphone access is required to record an Echo.")
        }
    }

    const stopRecording = () => {
        recordPlugin.current?.stopRecording()
    }

    const handleSave = async () => {
        if (!audioBlob) return

        setStep('processing')

        try {
            // Upload to R2
            const formData = new FormData()
            formData.append('audio', audioBlob, 'echo.webm')

            const res = await fetch('/api/echoes/upload', {
                method: 'POST',
                body: formData,
            })

            if (!res.ok) throw new Error("Upload failed")

            const { echoId } = await res.json()

            // Redirect to paywall
            router.push(`/unlock/${echoId}`)
        } catch (err) {
            console.error(err)
            alert("Failed to save your Echo. Please try again.")
            setStep('record')
        }
    }

    const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-purple-900/50 py-12 px-6 flex items-center justify-center">
            <div className="max-w-3xl w-full">
                {step === 'question' && (
                    <div className="text-center space-y-8 max-w-2xl mx-auto">
                        <h1 className="text-5xl font-black text-white leading-tight">
                            What do you want your great-grandchildren to know about <span className="text-purple-400">you</span>?
                        </h1>
                        <p className="text-xl text-gray-400">Your voice is a bridge across time. Start your legacy today.</p>
                        <button
                            onClick={() => setStep('record')}
                            className="px-10 py-5 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xl font-bold rounded-full hover:shadow-2xl transition hover:scale-105 active:scale-95"
                        >
                            Start Recording
                        </button>
                    </div>
                )}

                {step === 'record' && (
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-10 shadow-2xl">
                        <h2 className="text-3xl font-bold text-white mb-8 text-center">
                            Speak from your heart
                        </h2>

                        <div className="bg-black/40 rounded-3xl p-8 mb-8 border border-white/5">
                            <div ref={waveformRef} className="w-full" />
                        </div>

                        <div className="flex flex-col items-center mb-10">
                            <div className={`text-6xl font-mono font-black ${isRecording ? 'text-red-500 animate-pulse' : 'text-white'}`}>
                                {formatTime(duration)}
                            </div>
                            {isRecording && (
                                <div className="mt-2 flex items-center gap-2 text-red-500 font-bold uppercase tracking-widest text-sm">
                                    <span className="w-2 h-2 bg-red-500 rounded-full animate-ping" />
                                    Recording
                                </div>
                            )}
                        </div>

                        <div className="flex justify-center items-center gap-6">
                            {!isRecording && !audioBlob && (
                                <button
                                    onClick={startRecording}
                                    className="w-20 h-20 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg shadow-red-500/20 hover:scale-105 transition active:scale-95 border-4 border-white/10"
                                >
                                    <Mic className="w-8 h-8" />
                                </button>
                            )}

                            {isRecording && (
                                <button
                                    onClick={stopRecording}
                                    className="w-20 h-20 bg-gray-900 text-white rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition active:scale-95 border-4 border-white/10"
                                >
                                    <Square className="w-8 h-8" />
                                </button>
                            )}

                            {audioBlob && (
                                <>
                                    <button
                                        onClick={() => { setAudioBlob(null); setDuration(0) }}
                                        className="flex flex-col items-center gap-2 text-gray-400 hover:text-white transition"
                                    >
                                        <div className="w-14 h-14 bg-white/5 rounded-full flex items-center justify-center border border-white/10">
                                            <Trash2 className="w-6 h-6" />
                                        </div>
                                        <span className="text-xs font-bold uppercase tracking-widest">Discard</span>
                                    </button>

                                    <button
                                        onClick={() => wavesurfer.current?.playPause()}
                                        className="w-20 h-20 bg-purple-500 text-white rounded-full flex items-center justify-center shadow-lg shadow-purple-500/20 hover:scale-105 transition active:scale-95 border-4 border-white/10"
                                    >
                                        <Play className="w-8 h-8 ml-1" />
                                    </button>

                                    <button
                                        onClick={handleSave}
                                        className="px-10 py-5 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-black rounded-full shadow-xl shadow-purple-500/20 hover:scale-105 transition active:scale-95"
                                    >
                                        Save My Echo
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                )}

                {step === 'processing' && (
                    <div className="text-center">
                        <div className="relative w-32 h-32 mx-auto mb-10">
                            <div className="absolute inset-0 rounded-full border-4 border-purple-500/30" />
                            <div className="absolute inset-0 rounded-full border-4 border-purple-500 border-t-transparent animate-spin" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Sparkles className="w-12 h-12 text-purple-400 animate-pulse" />
                            </div>
                        </div>
                        <h2 className="text-4xl font-black text-white mb-4">Capturing the Eternal...</h2>
                        <p className="text-xl text-gray-400 leading-relaxed">Our AI is analyzing your voice patterns and <br />extracting the deep themes from your message.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
