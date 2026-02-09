import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Mic, Play, Clock, Calendar, ChevronRight, Lock, Sparkles } from 'lucide-react'

export default async function DashboardPage() {
    const { userId } = await auth()
    if (!userId) redirect('/sign-in')

    let user = await db.user.findUnique({
        where: { clerkId: userId },
        include: {
            echoes: {
                orderBy: { createdAt: 'desc' }
            }
        }
    })

    // Self-healing: If user is authenticated in Clerk but not in our DB
    if (!user) {
        const { currentUser } = await import('@clerk/nextjs/server')
        const clerkUser = await currentUser()

        if (clerkUser) {
            user = await db.user.create({
                data: {
                    clerkId: clerkUser.id,
                    email: clerkUser.emailAddresses[0].emailAddress,
                    fullName: `${clerkUser.firstName} ${clerkUser.lastName}`,
                    avatarUrl: clerkUser.imageUrl,
                },
                include: {
                    echoes: {
                        orderBy: { createdAt: 'desc' }
                    }
                }
            })
        }
    }

    if (!user) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6">
                <div className="text-center text-white space-y-4">
                    <h1 className="text-2xl font-bold">Setting up your profile...</h1>
                    <p className="text-gray-400">Please refresh in a moment.</p>
                    <Link href="/" className="inline-block text-purple-400 hover:underline">Back to Home</Link>
                </div>
            </div>
        )
    }

    const echoes = user.echoes

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-purple-900/50 py-12 px-6">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div>
                        <h1 className="text-5xl font-black text-white tracking-tight mb-2">My <span className="text-purple-400">Echoes</span></h1>
                        <p className="text-gray-400 text-lg">Your audio legacy, growing one story at a time.</p>
                    </div>
                    <Link
                        href="/create"
                        className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-black rounded-full shadow-xl shadow-purple-500/20 hover:scale-105 transition active:scale-95 flex items-center gap-2"
                    >
                        <Mic className="w-5 h-5" />
                        Create New Echo
                    </Link>
                </div>

                {echoes.length === 0 ? (
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-20 text-center space-y-6">
                        <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mx-auto mb-4 border border-white/10">
                            <Mic className="w-10 h-10 text-gray-400" />
                        </div>
                        <h2 className="text-3xl font-bold text-white">No Echoes recorded yet</h2>
                        <p className="text-gray-400 text-lg max-w-md mx-auto">Start your legacy journey by recording your first message for the future.</p>
                        <Link href="/create" className="inline-block px-8 py-4 bg-white text-slate-900 font-bold rounded-full hover:bg-gray-100 transition">Record Now</Link>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {echoes.map((echo: any) => (
                            <div
                                key={echo.id}
                                className="group bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 hover:border-purple-500/50 transition-all hover:shadow-2xl hover:shadow-purple-500/10 flex flex-col h-full"
                            >
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                                        <Calendar className="w-3 h-3" />
                                        {new Date(echo.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </div>
                                    {echo.transcriptionStatus === 'pending' || echo.transcriptionStatus === 'processing' ? (
                                        <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 text-amber-500 rounded-full text-[10px] font-bold uppercase tracking-wider border border-amber-500/20">
                                            <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse" />
                                            Analyzing
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-full text-[10px] font-bold uppercase tracking-wider border border-emerald-500/20">
                                            <Sparkles className="w-3 h-3" />
                                            Analyzed
                                        </div>
                                    )}
                                </div>

                                <h3 className="text-white text-xl font-black mb-4 group-hover:text-purple-400 transition-colors">
                                    Echo #{echo.id.slice(0, 8)}
                                </h3>

                                <div className="flex-1">
                                    {echo.aiSummary ? (
                                        <p className="text-gray-400 text-sm leading-relaxed line-clamp-3 mb-6 italic">
                                            "{echo.aiSummary.split('\n')[0]}"
                                        </p>
                                    ) : (
                                        <div className="h-20 flex items-center justify-center bg-black/20 rounded-2xl mb-6">
                                            <p className="text-gray-600 text-xs font-bold uppercase tracking-widest">Awaiting Analysis</p>
                                        </div>
                                    )}

                                    <div className="flex flex-wrap gap-2 mb-8">
                                        {echo.themes.slice(0, 3).map((theme: string, i: number) => (
                                            <span key={i} className="text-[10px] font-bold uppercase tracking-widest text-purple-400/80">#{theme}</span>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2 text-gray-500 text-xs font-bold">
                                        <Clock className="w-3.5 h-3.5" />
                                        {echo.duration > 0 ? `${Math.floor(echo.duration / 60)}:${(echo.duration % 60).toString().padStart(2, '0')}` : 'Voice'}
                                    </div>
                                    <Link
                                        href={`/echoes/${echo.id}`}
                                        className="flex-1 flex items-center justify-between px-6 py-3 bg-white/5 text-white font-bold rounded-2xl hover:bg-white/10 transition group/btn border border-white/5"
                                    >
                                        Listen
                                        <Play className="w-4 h-4 fill-current group-hover/btn:scale-110 transition-transform" />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
