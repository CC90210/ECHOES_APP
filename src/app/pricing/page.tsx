'use client'

import { Check, Sparkles, Shield, Rocket, Mic, Zap } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'

const STRIPE_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder'
const stripePromise = loadStripe(STRIPE_KEY)

const tiers = [
    {
        name: 'Free',
        price: '$0',
        description: 'Perfect for trying ECHOES',
        features: [
            'Record 1 high-fidelity Echo',
            'Basic AI Analysis',
            'Lifetime storage',
            'Share with anyone'
        ],
        buttonText: 'Get Started',
        href: '/create',
        highlight: false
    },
    {
        name: 'Premium',
        price: '$9.99',
        unit: '/mo',
        description: 'Build your complete legacy',
        features: [
            'Unlimited Echo recordings',
            'Advanced AI Deep Insights',
            'Priority Transcription',
            'Download audio files',
            'Early access to Voice Cloning',
            'Voice cloning & AI recreation (coming soon)'
        ],
        buttonText: 'Start Premium',
        priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_PREMIUM!,
        highlight: true
    }
]

export default function PricingPage() {
    const [isLoading, setIsLoading] = useState<string | null>(null)

    const handleSubscribe = async (priceId: string) => {
        setIsLoading(priceId)
        try {
            const res = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ priceId }),
            })
            const session = await res.json()
            const stripe = await stripePromise
            if (stripe) {
                await (stripe as any).redirectToCheckout({ sessionId: session.sessionId })
            }
        } catch (err) {
            console.error(err)
            alert("Subscription failed. Please try again.")
        } finally {
            setIsLoading(null)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-purple-900/50 py-24 px-6">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-20 space-y-4">
                    <h1 className="text-6xl font-black text-white tracking-tight">Simple, Transparent <span className="text-purple-400">Pricing</span></h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">Choose the plan that fits your legacy. No hidden fees, just your voice, forever.</p>
                </div>

                <div className="grid md:grid-cols-2 gap-10 max-w-5xl mx-auto">
                    {tiers.map((tier) => (
                        <div
                            key={tier.name}
                            className={`relative bg-white/5 backdrop-blur-2xl border ${tier.highlight ? 'border-purple-500 shadow-2xl shadow-purple-500/10' : 'border-white/10'} rounded-[3rem] p-12 overflow-hidden flex flex-col`}
                        >
                            {tier.highlight && (
                                <div className="absolute top-0 right-0 py-2 px-6 bg-purple-500 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-bl-3xl">
                                    Recommended
                                </div>
                            )}

                            <div className="mb-8">
                                <h3 className="text-2xl font-black text-white mb-2">{tier.name}</h3>
                                <p className="text-gray-400 text-sm">{tier.description}</p>
                            </div>

                            <div className="flex items-baseline gap-1 mb-10">
                                <span className="text-6xl font-black text-white">{tier.price}</span>
                                {tier.unit && <span className="text-gray-400 text-xl font-bold">{tier.unit}</span>}
                            </div>

                            <ul className="space-y-6 mb-12 flex-1">
                                {tier.features.map((feature) => (
                                    <li key={feature} className="flex items-center gap-4 text-gray-300 font-medium">
                                        <div className={`w-6 h-6 rounded-full ${tier.highlight ? 'bg-purple-500/20' : 'bg-white/10'} flex items-center justify-center shrink-0`}>
                                            <Check className={`w-3.5 h-3.5 ${tier.highlight ? 'text-purple-400' : 'text-gray-400'}`} />
                                        </div>
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            {tier.priceId ? (
                                <button
                                    onClick={() => handleSubscribe(tier.priceId!)}
                                    disabled={!!isLoading}
                                    className="w-full py-5 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-black rounded-full shadow-2xl shadow-purple-500/20 hover:scale-[1.02] transition active:scale-95 disabled:opacity-50 flex items-center justify-center"
                                >
                                    {isLoading === tier.priceId ? <Zap className="w-6 h-6 animate-pulse" /> : tier.buttonText}
                                </button>
                            ) : (
                                <Link
                                    href={tier.href || '/'}
                                    className="w-full py-5 bg-white/10 text-white text-center font-black rounded-full hover:bg-white/20 transition"
                                >
                                    {tier.buttonText}
                                </Link>
                            )}
                        </div>
                    ))}
                    {/* Immortality Tier */}
                    <div className="md:col-span-2 max-w-2xl mx-auto mt-20 w-full">
                        <div className="relative bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur border-2 border-purple-500 rounded-[2.5rem] p-12 overflow-hidden">
                            <div className="absolute top-0 right-0 left-0 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-black uppercase tracking-[0.2em] py-3 text-center">
                                Coming Soon — Join Waitlist
                            </div>

                            <div className="text-center mb-10 mt-6">
                                <h3 className="text-3xl font-black text-white mb-2">Digital Immortality</h3>
                                <div className="flex items-center justify-center gap-2 mb-4">
                                    <span className="text-5xl font-black text-white">$499</span>
                                    <span className="text-gray-400 text-lg font-bold">/one-time</span>
                                </div>
                                <p className="text-gray-300 max-w-md mx-auto">Train a custom AI model on your voice and personality. Let your great-grandchildren have a conversation with you.</p>
                            </div>

                            <ul className="space-y-4 mb-10 max-w-md mx-auto">
                                {[
                                    'Everything in Premium',
                                    'Custom AI voice model trained on your Echoes',
                                    'Generate new messages in your voice (100/mo)',
                                    'Conversational AI trained on your beliefs & values',
                                    'Your family can "talk" to you after you\'re gone'
                                ].map((feature) => (
                                    <li key={feature} className="flex items-center gap-4 text-gray-300 font-medium">
                                        <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center shrink-0">
                                            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                                        </div>
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            <button className="w-full py-5 bg-white/5 text-white/50 border border-white/10 font-black rounded-full cursor-not-allowed hover:bg-white/10 transition">
                                Join Waitlist
                            </button>

                            <p className="text-center text-xs text-gray-500 mt-6 uppercase tracking-widest font-bold">
                                Every Echo you create now is training data
                            </p>
                        </div>
                    </div>
                </div>

                {/* Feature Comparison */}
                <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-12 text-center border-t border-white/5 pt-24">
                    <div className="space-y-4">
                        <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <Shield className="w-8 h-8 text-emerald-400" />
                        </div>
                        <h4 className="text-xl font-bold text-white">Military Grade Privacy</h4>
                        <p className="text-gray-500 text-sm">Your voice and transcriptions are encrypted and stored in secure private vaults.</p>
                    </div>
                    <div className="space-y-4">
                        <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <Rocket className="w-8 h-8 text-indigo-400" />
                        </div>
                        <h4 className="text-xl font-bold text-white">Global CDN</h4>
                        <p className="text-gray-500 text-sm">Lightning fast playback across the globe, ensuring your voice is heard instantly.</p>
                    </div>
                    <div className="space-y-4">
                        <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <Mic className="w-8 h-8 text-purple-400" />
                        </div>
                        <h4 className="text-xl font-bold text-white">High Fidelity</h4>
                        <p className="text-gray-500 text-sm">We use loss-less audio compression to preserve the unique character of your voice.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
