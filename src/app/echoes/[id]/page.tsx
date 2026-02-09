import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { redirect } from 'next/navigation'
import { Play, Calendar, Clock, MapPin, Tag, Sparkles, MessageSquare, ArrowLeft, Heart, Share2, Download } from 'lucide-react'
import Link from 'next/link'

export default async function EchoDetailPage({ params }: { params: { id: string } }) {
    const { userId } = await auth()
    const echo = await db.echo.findUnique({
        where: { id: params.id },
        include: { question: true }
    })

    if (!echo) redirect('/dashboard')

    // Basic access check: if it's not public and not yours, redirect
    // (In MVP launch, we might just allow viewing by ID if shared)

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-purple-900/50 py-12 px-6">
            <div className="max-w-4xl mx-auto">
                <Link href="/dashboard" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition mb-8 group">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back to Dashboard
                </Link>

                <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[3rem] overflow-hidden shadow-2xl">
                    {/* Header / Player Area */}
                    <div className="p-12 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-b border-white/5 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-12 opacity-5 scale-150">
                            <Heart className="w-64 h-64" />
                        </div>

                        <div className="relative z-10 flex flex-col items-center text-center">
                            <div className="w-24 h-24 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center shadow-2xl shadow-purple-500/20 mb-8 hover:scale-105 transition active:scale-95 cursor-pointer group">
                                <Play className="w-10 h-10 text-white fill-current ml-1 group-hover:scale-110 transition-transform" />
                            </div>

                            <h1 className="text-4xl font-black text-white mb-4 leading-tight">
                                {echo.question?.questionText || "A shared memory"}
                            </h1>

                            <div className="flex items-center gap-6 text-gray-400 text-sm font-bold uppercase tracking-widest">
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-purple-400" />
                                    {new Date(echo.createdAt).toLocaleDateString()}
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-purple-400" />
                                    {echo.duration > 0 ? `${Math.floor(echo.duration / 60)}:${(echo.duration % 60).toString().padStart(2, '0')}` : 'Voice Note'}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="p-12 space-y-12">
                        {/* AI Summary */}
                        {echo.aiSummary && (
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 text-purple-400 font-bold uppercase tracking-widest text-xs">
                                    <Sparkles className="w-4 h-4" />
                                    AI Insight & Summary
                                </div>
                                <p className="text-2xl text-white font-medium leading-relaxed italic">
                                    "{echo.aiSummary}"
                                </p>
                            </div>
                        )}

                        {/* Transcription */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-gray-500 font-bold uppercase tracking-widest text-xs">
                                <MessageSquare className="w-4 h-4 text-gray-600" />
                                Full Transcription
                            </div>
                            <div className="bg-black/20 rounded-[2rem] p-8 border border-white/5">
                                <p className="text-gray-300 text-lg leading-loose">
                                    {echo.transcription || "Your transcription is being processed. It will appear here shortly."}
                                </p>
                            </div>
                        </div>

                        {/* Metadata Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-white/5">
                            <div className="space-y-4">
                                <h4 className="text-xs font-bold uppercase tracking-widest text-gray-500">Key Themes</h4>
                                <div className="flex flex-wrap gap-2">
                                    {echo.themes.length > 0 ? echo.themes.map((theme: string) => (
                                        <span key={theme} className="px-4 py-2 bg-purple-500/10 text-purple-400 rounded-full text-xs font-bold border border-purple-500/10">
                                            #{theme}
                                        </span>
                                    )) : <span className="text-gray-600 text-xs italic">No themes extracted yet</span>}
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-4">
                                <button className="p-4 bg-white/5 text-white rounded-2xl hover:bg-white/10 transition border border-white/5 flex items-center gap-2 text-sm font-bold">
                                    <Share2 className="w-4 h-4" />
                                    Share
                                </button>
                                <button className="p-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl hover:shadow-xl transition flex items-center gap-2 text-sm font-bold">
                                    <Download className="w-4 h-4" />
                                    Download
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
