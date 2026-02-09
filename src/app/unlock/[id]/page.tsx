'use client'

import { useParams, useRouter } from 'next/navigation'
import { loadStripe } from '@stripe/stripe-js'
import { Lock, Sparkles, ShieldCheck, Zap, ArrowRight } from 'lucide-react'
import { useState } from 'react'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export default function UnlockPage() {
    const params = useParams()
    const router = useRouter()
    const echoId = params.id as string
    const [isLoading, setIsLoading] = useState(false)

    const handleUnlock = async () => {
        setIsLoading(true)
        try {
            const res = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ONE_TIME!,
                    echoId,
                }),
            })

            const { sessionId, error } = await res.json()
            if (error) throw new Error(error)

            const stripe = await stripePromise
            if (stripe) {
                await (stripe as any).redirectToCheckout({ sessionId })
            }
        } catch (err) {
            console.error(err)
            alert("Something went wrong with the checkout process.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-purple-900/50 py-12 px-6 flex items-center justify-center">
            <div className="max-w-md w-full relative">
                {/* Decorative Background */}
                <div className="absolute -inset-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-[3rem] blur-2xl opacity-20 animate-pulse" />

                <div className="relative bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-10 shadow-2xl overflow-hidden">
                    {/* Top Shine */}
                    <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                    <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mx-auto mb-8 shadow-xl shadow-purple-500/20">
                        <Sparkles className="w-10 h-10 text-white" />
                    </div>

                    <h1 className="text-3xl font-black text-white text-center mb-6 leading-tight">
                        Analysis Ready
                    </h1>

                    <div className="bg-black/20 rounded-3xl p-6 mb-8 border border-white/5 space-y-6">
                        <p className="text-purple-400 font-bold uppercase tracking-widest text-[10px] text-center">AI Insights Generated</p>

                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                                    <Zap className="w-4 h-4 text-amber-400" />
                                </div>
                                <div>
                                    <p className="text-white font-bold text-sm">Emotional Tone Profile</p>
                                    <p className="text-gray-400 text-xs mt-1">Discover the subconscious emotional states detected in your voice.</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                                </div>
                                <div>
                                    <p className="text-white font-bold text-sm">Deep Thematic Analysis</p>
                                    <p className="text-gray-400 text-xs mt-1">Extract core wisdom and key life lessons from your narrative.</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                                    <Sparkles className="w-4 h-4 text-purple-400" />
                                </div>
                                <div>
                                    <p className="text-white font-bold text-sm">AI Summary & Titles</p>
                                    <p className="text-gray-400 text-xs mt-1">A professionally concise distillation of your unique story.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={handleUnlock}
                        disabled={isLoading}
                        className="w-full py-5 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-black rounded-full shadow-2xl shadow-purple-500/20 hover:scale-[1.02] transition active:scale-95 flex items-center justify-center gap-3 group"
                    >
                        {isLoading ? (
                            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>
                                Unlock Analysis — $4.99
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>

                    <div className="mt-8 text-center space-y-4">
                        <p className="text-xs text-gray-400">
                            Or <a href="/pricing" className="text-purple-400 font-bold hover:underline">upgrade to Premium</a> for unlimited access
                        </p>
                        <div className="flex items-center justify-center gap-2 text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                            <Lock className="w-3 h-3" />
                            Secure SSL Payment
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
