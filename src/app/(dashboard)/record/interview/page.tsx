'use client'

import { useState, useRef, useEffect } from "react"
import { api } from "@/lib/trpc"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MessageSquare, Send, Mic2, Square, Loader2, User, Sparkles } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface Message {
    role: 'user' | 'assistant'
    content: string
}

export default function InterviewPage() {
    const [messages, setMessages] = useState<Message[]>([])
    const [input, setInput] = useState("")
    const [isThinking, setIsThinking] = useState(false)
    const [sessionId, setSessionId] = useState<string | null>(null)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    // Mutation stubs (since tRPC is set up but needs envs)
    const startInterview = async () => {
        setIsThinking(true)
        // Simulated API call
        setTimeout(() => {
            setMessages([{
                role: 'assistant',
                content: "Hello! I'm your ECHOES interview assistant. Today we're exploring the question: 'What is the most important lesson your parents taught you?' Whenever you're ready, tell me a bit about what comes to mind."
            }])
            setSessionId("mock-session")
            setIsThinking(false)
        }, 1500)
    }

    const sendMessage = async () => {
        if (!input.trim() || isThinking) return

        const userMsg = input
        setInput("")
        setMessages(prev => [...prev, { role: 'user', content: userMsg }])
        setIsThinking(true)

        // Simulated API call
        setTimeout(() => {
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: "That's a profound thought. Could you tell me more about how that lesson has influenced the way you make decisions today?"
            }])
            setIsThinking(false)
        }, 2000)
    }

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages])

    useEffect(() => {
        startInterview()
    }, [])

    return (
        <div className="flex flex-col h-[calc(100vh-12rem)] max-w-4xl mx-auto bg-white rounded-3xl border border-neutral-100 shadow-xl overflow-hidden">
            {/* Header */}
            <div className="bg-indigo-600 p-6 flex items-center justify-between text-white">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
                        <MessageSquare className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold">Guided Interview</h2>
                        <p className="text-indigo-100 text-sm">AI Interviewer — Active</p>
                    </div>
                </div>
                <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20 rounded-full">
                    End Session
                </Button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-8 space-y-6">
                {messages.map((msg, idx) => (
                    <div key={idx} className={`flex items-start gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                        <Avatar className={`w-10 h-10 border-2 ${msg.role === 'assistant' ? 'border-indigo-100' : 'border-neutral-100'}`}>
                            {msg.role === 'assistant' ? (
                                <AvatarFallback className="bg-indigo-600 text-white"><Sparkles className="w-5 h-5" /></AvatarFallback>
                            ) : (
                                <AvatarFallback className="bg-neutral-100 text-neutral-400"><User className="w-5 h-5" /></AvatarFallback>
                            )}
                        </Avatar>
                        <div className={`max-w-[80%] p-5 rounded-3xl text-[15px] leading-relaxed ${msg.role === 'assistant'
                            ? 'bg-neutral-50 text-neutral-800 rounded-tl-none'
                            : 'bg-indigo-600 text-white rounded-tr-none shadow-lg shadow-indigo-100'
                            }`}>
                            {msg.content}
                        </div>
                    </div>
                ))}
                {isThinking && (
                    <div className="flex items-start gap-4">
                        <Avatar className="w-10 h-10 border-2 border-indigo-100">
                            <AvatarFallback className="bg-indigo-600 text-white animate-pulse"><Sparkles className="w-5 h-5" /></AvatarFallback>
                        </Avatar>
                        <div className="bg-neutral-50 p-4 rounded-3xl rounded-tl-none flex gap-1">
                            <div className="w-2 h-2 bg-indigo-200 rounded-full animate-bounce [animation-delay:-0.3s]" />
                            <div className="w-2 h-2 bg-indigo-200 rounded-full animate-bounce [animation-delay:-0.15s]" />
                            <div className="w-2 h-2 bg-indigo-200 rounded-full animate-bounce" />
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-6 border-t border-neutral-100 bg-neutral-50/50">
                <div className="flex items-center gap-4 bg-white p-2 pl-6 rounded-full border border-neutral-200 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 transition-all">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                        placeholder="Type your answer or use your voice..."
                        className="flex-1 bg-transparent outline-none py-3"
                    />
                    <div className="flex items-center gap-2">
                        <Button size="icon" variant="ghost" className="rounded-full hover:bg-neutral-100 text-neutral-500">
                            <Mic2 className="w-5 h-5" />
                        </Button>
                        <Button
                            size="icon"
                            onClick={sendMessage}
                            disabled={!input.trim() || isThinking}
                            className="w-12 h-12 rounded-full bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-100"
                        >
                            <Send className="w-5 h-5 text-white" />
                        </Button>
                    </div>
                </div>
                <p className="text-center text-[10px] text-neutral-400 mt-4 uppercase tracking-widest font-bold">
                    Powered by GPT-4o — All conversations are private and encrypted
                </p>
            </div>
        </div>
    )
}
