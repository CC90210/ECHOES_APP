'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle2, ArrowRight, Sparkles, Mic, LayoutDashboard, Loader2 } from 'lucide-react'
import { useEffect, useState, Suspense } from 'react'

function SuccessContent() {
    const searchParams = useSearchParams()
    const echoId = searchParams.get('echo_id')
    const sessionId = searchParams.get('session_id')

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-purple-900/50 py-12 px-6 flex items-center justify-center">
            <div className="max-w-xl w-full text-center">
                <div className="mb-12 relative inline-block">
                    <div className="absolute inset-0 bg-emerald-500 blur-3xl opacity-20 animate-pulse" />
                    <div className="relative w-32 h-32 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-[2.5rem] flex items-center justify-center shadow-2xl shadow-emerald-500/20">
                        <CheckCircle2 className="w-16 h-16 text-white" />
                    </div>
                </div>

                <h1 className="text-5xl font-black text-white mb-6 tracking-tight">Payment <span className="text-emerald-400">Successful</span></h1>
                <p className="text-2xl text-gray-400 mb-12 leading-relaxed">Your legacy is now unlocked. Thank you for trusting ECHOES with your story.</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {echoId && (
                        <Link
                            href={`/echoes/${echoId}`}
                            className="flex flex-col items-center gap-4 bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-[2rem] hover:bg-white/10 transition-all hover:scale-[1.02] group"
                        >
                            <div className="w-12 h-12 bg-purple-500/20 rounded-2xl flex items-center justify-center">
                                <Mic className="w-6 h-6 text-purple-400" />
                            </div>
                            <div className="text-center">
                                <p className="text-white font-bold">View Unlocked Echo</p>
                                <p className="text-gray-500 text-xs mt-1">Dive into your AI analysis</p>
                            </div>
                            <ArrowRight className="w-5 h-5 text-gray-500 group-hover:translate-x-1 group-hover:text-white transition-all mt-2" />
                        </Link>
                    )}

                    <Link
                        href="/dashboard"
                        className="flex flex-col items-center gap-4 bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-[2rem] hover:bg-white/10 transition-all hover:scale-[1.02] group"
                    >
                        <div className="w-12 h-12 bg-indigo-500/20 rounded-2xl flex items-center justify-center">
                            <LayoutDashboard className="w-6 h-6 text-indigo-400" />
                        </div>
                        <div className="text-center">
                            <p className="text-white font-bold">Your Dashboard</p>
                            <p className="text-gray-500 text-xs mt-1">Manage your audio vault</p>
                        </div>
                        <ArrowRight className="w-5 h-5 text-gray-500 group-hover:translate-x-1 group-hover:text-white transition-all mt-2" />
                    </Link>
                </div>

                <div className="mt-16 bg-white/5 p-6 rounded-3xl inline-flex items-center gap-4 border border-white/5">
                    <Sparkles className="w-5 h-5 text-purple-400" />
                    <p className="text-gray-400 text-sm font-medium">Want to record more? <Link href="/create" className="text-white font-bold hover:underline">Start your next Echo</Link></p>
                </div>
            </div>
        </div>
    )
}

export default function SuccessPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
                <Loader2 className="w-8 h-8 animate-spin" />
            </div>
        }>
            <SuccessContent />
        </Suspense>
    )
}
