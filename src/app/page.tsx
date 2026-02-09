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

          <audio
            ref={audioRef}
            src="https://www2.cs.uic.edu/~i101/SoundFiles/BabyElephantWalk60.wav"
            onEnded={() => setIsPlaying(false)}
          />

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

      {/* Digital Immortality Section */}
      <section className="py-24 px-6 bg-gradient-to-b from-purple-900 to-slate-900">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-5xl font-bold text-white mb-6">
            We're Building Digital Immortality
          </h2>
          <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto">
            Your voice isn't just preserved—it's eternal.
            We transcribe every Echo, analyze your speaking patterns,
            and train AI on your unique voice and thought patterns.
          </p>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-8">
              <div className="w-16 h-16 rounded-full bg-purple-500 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Voice Preservation</h3>
              <p className="text-gray-400">
                Every Echo you create trains our AI on your unique voice,
                cadence, and speaking style.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-8">
              <div className="w-16 h-16 rounded-full bg-pink-500 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Pattern Learning</h3>
              <p className="text-gray-400">
                Our AI learns how you think, what matters to you,
                and how you express complex ideas.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-8">
              <div className="w-16 h-16 rounded-full bg-purple-500 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Voice Resurrection</h3>
              <p className="text-gray-400">
                In the future, your family can generate new messages
                in your voice, answering questions you never recorded.
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur border-2 border-purple-400 rounded-2xl p-8 max-w-3xl mx-auto">
            <p className="text-white text-lg mb-4">
              <strong>Imagine this:</strong> In 2075, your great-grandchildren ask,
              "What did you think about climate change?"
              An AI trained on all your Echoes responds—<em>in your voice</em>—
              with an answer that sounds exactly like you.
            </p>
            <p className="text-purple-300 text-sm">
              Premium feature coming soon. Every Echo you create today
              is training data for your digital immortality.
            </p>
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
              <ul className="space-y-4 mb-8 text-left">
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
                  Early access to Voice Cloning
                </li>
              </ul>
              <Link href="/sign-up" className="block w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-center font-semibold rounded-full hover:shadow-xl transition">
                Start Premium
              </Link>
            </div>

            {/* Immortality Tier */}
            <div className="md:col-span-2 max-w-2xl mx-auto w-full">
              <div className="relative bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur border-2 border-purple-500 rounded-3xl p-10 overflow-hidden text-center">
                <div className="absolute top-0 right-0 left-0 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold uppercase tracking-widest py-2">
                  Coming Soon
                </div>
                <h3 className="text-3xl font-black text-white mt-6 mb-2">Digital Immortality</h3>
                <div className="text-5xl font-black text-white mb-6">$499<span className="text-lg text-gray-400">/one-time</span></div>
                <p className="text-gray-300 mb-8 max-w-md mx-auto">The ultimate legacy. An AI version of yourself that lives forever, powered by your voice and memories.</p>
                <div className="flex justify-center">
                  <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-white/5 border border-white/10 text-gray-400 text-sm font-bold uppercase tracking-widest">
                    <Sparkles className="w-4 h-4" /> Waitlist Open
                  </div>
                </div>
              </div>
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
