import { EchoGrid } from "@/components/echo/EchoGrid"
import { Button } from "@/components/ui/button"
import { PlusCircle, Search, Filter } from "lucide-react"
import Link from "next/link"

// Mock data
const mockEchoes = [
    {
        id: "1",
        audioUrl: "",
        duration: 124,
        recordedAt: new Date(2024, 1, 1),
        transcriptionStatus: "completed",
        aiSummary: "A heart-warming story about Grandpa learning how to use a computer for the first time.",
        emotionalTone: "Humorous",
        themes: ["Family", "Technology"],
        tags: ["grandpa", "funny"],
        isLocked: false,
        question: {
            questionText: "What's your funniest recent memory?"
        }
    },
    {
        id: "2",
        audioUrl: "",
        duration: 310,
        recordedAt: new Date(2024, 0, 15),
        transcriptionStatus: "completed",
        aiSummary: "Advice on choosing a career path and the importance of following your curiosity over money.",
        emotionalTone: "Wise",
        themes: ["Career", "Wisdom"],
        tags: ["advice"],
        isLocked: true,
        unlockDate: new Date(2030, 0, 1),
        question: {
            questionText: "What career advice would you give your younger self?"
        }
    },
    {
        id: "3",
        audioUrl: "",
        duration: 45,
        recordedAt: new Date(2023, 11, 20),
        transcriptionStatus: "completed",
        aiSummary: "Brief thoughts on the beauty of a quiet winter morning in Toronto.",
        emotionalTone: "Peaceful",
        themes: ["Nature"],
        tags: ["daily"],
        isLocked: false
    }
]

export default function VaultPage() {
    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black tracking-tight text-neutral-900 mb-2">
                        The <span className="text-indigo-600">Vault</span>
                    </h1>
                    <p className="text-lg text-neutral-500 font-medium">
                        Your life stories, preserved forever in your own voice.
                    </p>
                </div>
                <Button asChild size="lg" className="rounded-full bg-indigo-600 hover:bg-indigo-700 h-14 px-8 shadow-lg shadow-indigo-100">
                    <Link href="/record">
                        <PlusCircle className="w-5 h-5 mr-2" />
                        Record New Echo
                    </Link>
                </Button>
            </div>

            {/* Filters & Search */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <input
                        type="text"
                        placeholder="Search transcriptions, themes, or tags..."
                        className="w-full h-12 pl-12 pr-4 bg-white border border-neutral-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all shadow-sm"
                    />
                </div>
                <Button variant="outline" className="h-12 rounded-2xl px-6 border-neutral-200 bg-white shadow-sm font-semibold">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                </Button>
            </div>

            {/* Echoes Grid */}
            <EchoGrid echoes={mockEchoes as any} />

            {/* Empty State / End of List */}
            <div className="py-20 text-center">
                <p className="text-neutral-400 font-medium italic">
                    You've reached the end of your vault memories.
                </p>
            </div>
        </div>
    )
}
