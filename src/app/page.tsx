'use client'

import { useState, useRef } from 'react'
import { Play, Pause, Sparkles, Check } from 'lucide-react'
import Link from 'next/link'

export default function LandingPage() {
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  const togglePlay = () => {
    if (!audioRef.current) return
    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900">
      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center px-6">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Your voice shouldn't disappear
            <br />
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              when you do
            </span>
          </h1>

          <p className="text-xl text-gray-300 mb-12">
            Leave voice messages for people who aren't born yet.
            <br />Create an audio legacy that lasts forever.
          </p>

          {/* Sample Echo Player */}
          <div className="inline-flex items-center gap-4 bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 mb-12">
            <button
              onClick={togglePlay}
              className="w-14 h-14 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center hover:scale-105 transition shadow-lg shadow-purple-500/20"
            >
              {isPlaying ? <Pause className="w-6 h-6 text-white" /> : <Play className="w-6 h-6 text-white ml-1" />}
            </button>
            <div className="text-left">
              <p className="text-white font-semibold">Listen to an Echo from 1985</p>
              <p className="text-gray-400 text-sm">A grandfather answering: "What do you wish you'd known at 25?"</p>
            </div>
          </div>

          <audio ref={audioRef} src="/samples/echo-1985.mp3" onEnded={() => setIsPlaying(false)} />

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/create"
              className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-lg font-semibold rounded-full hover:shadow-2xl transition hover:scale-105 active:scale-95"
            >
              Create Your First Echo (Free)
            </Link>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-6 border-t border-white/5 bg-black/20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-white text-center mb-16">Simple Pricing</h2>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free */}
            <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-colors">
              <h3 className="text-2xl font-bold text-white mb-4">Free</h3>
              <div className="text-4xl font-bold text-white mb-6">$0</div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3 text-gray-300">
                  <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center">
                    <Check className="w-3 h-3 text-green-400" />
                  </div>
                  Create 1 Echo
                </li>
                <li className="flex items-center gap-3 text-gray-300">
                  <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center">
                    <Check className="w-3 h-3 text-green-400" />
                  </div>
                  Basic transcription
                </li>
                <li className="flex items-center gap-3 text-gray-300">
                  <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center">
                    <Check className="w-3 h-3 text-green-400" />
                  </div>
                  Permanent storage
                </li>
              </ul>
              <Link href="/create" className="block w-full py-3 bg-white/10 text-white text-center font-semibold rounded-full hover:bg-white/20 transition">
                Get Started
              </Link>
            </div>

            {/* Premium */}
            <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur border-2 border-purple-400 rounded-2xl p-8 relative hover:scale-[1.02] transition-transform shadow-2xl shadow-purple-500/10">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-purple-500 text-white text-sm font-semibold rounded-full shadow-lg">
                Most Popular
              </div>

              <h3 className="text-2xl font-bold text-white mb-4">Premium</h3>
              <div className="text-4xl font-bold text-white mb-6">$9.99<span className="text-lg text-gray-300">/mo</span></div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3 text-gray-300">
                  <div className="w-5 h-5 rounded-full bg-purple-500/20 flex items-center justify-center">
                    <Check className="w-3 h-3 text-purple-400" />
                  </div>
                  Unlimited Echoes
                </li>
                <li className="flex items-center gap-3 text-gray-300">
                  <div className="w-5 h-5 rounded-full bg-purple-500/20 flex items-center justify-center">
                    <Check className="w-3 h-3 text-purple-400" />
                  </div>
                  Full AI analysis on all Echoes
                </li>
                <li className="flex items-center gap-3 text-gray-300">
                  <div className="w-5 h-5 rounded-full bg-purple-500/20 flex items-center justify-center">
                    <Check className="w-3 h-3 text-purple-400" />
                  </div>
                  Professional transcription
                </li>
                <li className="flex items-center gap-3 text-gray-300">
                  <div className="w-5 h-5 rounded-full bg-purple-500/20 flex items-center justify-center">
                    <Check className="w-3 h-3 text-purple-400" />
                  </div>
                  Download all Echoes
                </li>
              </ul>
              <Link href="/sign-up" className="block w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-center font-semibold rounded-full hover:shadow-xl transition">
                Start Premium
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/5 text-center text-gray-500">
        <p>© 2026 ECHOES — Speed Mode. All rights reserved.</p>
      </footer>
    </div>
  )
}
