import { StatCard } from '@/components/dashboard/StatCard'
import { QuickActions } from '@/components/dashboard/QuickActions'
import { WeeklyPrompt } from '@/components/dashboard/WeeklyPrompt'
import { Button } from '@/components/ui/button'
import { Library } from 'lucide-react'
import Link from 'next/link'

// Mock data (replace with tRPC calls once DB is seeded)
const stats = {
    totalEchoes: 12,
    totalDuration: "45m",
    lockedEchoes: 4
}

const weeklyQuestion = {
    id: 1,
    questionText: "What is the most important lesson your parents taught you?",
    category: "VALUES"
}

export default function DashboardPage() {
    return (
        <div className="space-y-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black tracking-tight text-neutral-900 mb-2">
                        Welcome back, <span className="text-indigo-600">Alex</span>
                    </h1>
                    <p className="text-lg text-neutral-500 font-medium">
                        Your voice deserves to be heard. Not just today — forever.
                    </p>
                </div>
                <Button asChild size="lg" className="rounded-full bg-neutral-900 text-white hover:bg-black group px-8">
                    <Link href="/vault">
                        <Library className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                        Explore Your Vault
                    </Link>
                </Button>
            </div>

            {/* Weekly Prompt */}
            <WeeklyPrompt question={weeklyQuestion} />

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    label="Total Echoes"
                    value={stats.totalEchoes}
                    icon="🎙️"
                    trend={{ value: 12, positive: true }}
                />
                <StatCard
                    label="Total Duration"
                    value={stats.totalDuration}
                    icon="⏱️"
                />
                <StatCard
                    label="Locked Echoes"
                    value={stats.lockedEchoes}
                    icon="🔒"
                />
            </div>

            {/* Quick Actions */}
            <section>
                <div className="flex items-center gap-2 mb-6">
                    <h2 className="text-2xl font-bold text-neutral-900">Quick Actions</h2>
                    <div className="h-[2px] flex-1 bg-neutral-100 mt-1" />
                </div>
                <QuickActions />
            </section>

            {/* Recent Echoes placeholder */}
            <section className="bg-white rounded-3xl p-10 border-2 border-dashed border-neutral-200 text-center">
                <div className="w-16 h-16 bg-neutral-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Library className="w-8 h-8 text-neutral-300" />
                </div>
                <h3 className="text-xl font-bold text-neutral-900 mb-2">No Echoes yet</h3>
                <p className="text-neutral-500 mb-6 max-w-sm mx-auto">
                    Your vault is waiting for your first story. Start recording today to preserve your legacy.
                </p>
                <Button asChild className="rounded-full bg-indigo-600 hover:bg-indigo-700 h-12 px-8">
                    <Link href="/record">Record Your First Echo</Link>
                </Button>
            </section>
        </div>
    )
}
