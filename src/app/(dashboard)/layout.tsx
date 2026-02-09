'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { UserButton } from '@clerk/nextjs'
import {
    LayoutDashboard,
    Mic2,
    Library,
    Layers,
    Compass,
    History,
    Settings,
    PlusCircle,
    Menu,
    X
} from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Vault', href: '/vault', icon: Library },
    { name: 'Record', href: '/record', icon: Mic2 },
    { name: 'Collections', href: '/collections', icon: Layers },
    { name: 'Discover', href: '/discover', icon: Compass },
    { name: 'Legacy Planning', href: '/legacy', icon: History },
]

const secondaryNavigation = [
    { name: 'Settings', href: '/settings', icon: Settings },
]

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname()
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)

    return (
        <div className="flex min-h-screen bg-neutral-50">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-neutral-900/50 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={cn(
                "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-neutral-200 transform transition-transform duration-300 lg:translate-x-0 lg:static lg:inset-0",
                isSidebarOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="flex items-center h-16 px-6 border-b border-neutral-100">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                                <Mic2 className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xl font-bold tracking-tight text-neutral-900">ECHOES</span>
                        </div>
                    </div>

                    {/* Main Nav */}
                    <nav className="flex-1 px-4 py-6 space-y-1">
                        {navigation.map((item) => {
                            const isActive = pathname === item.href
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={cn(
                                        "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-xl transition-colors",
                                        isActive
                                            ? "bg-indigo-50 text-indigo-600"
                                            : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
                                    )}
                                >
                                    <item.icon className={cn("w-5 h-5", isActive ? "text-indigo-600" : "text-neutral-400")} />
                                    {item.name}
                                </Link>
                            )
                        })}
                    </nav>

                    {/* Secondary Nav */}
                    <div className="px-4 py-6 border-t border-neutral-100">
                        <div className="space-y-1">
                            {secondaryNavigation.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-neutral-600 rounded-xl hover:bg-neutral-50 hover:text-neutral-900 transition-colors"
                                >
                                    <item.icon className="w-5 h-5 text-neutral-400" />
                                    {item.name}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* User Profile */}
                    <div className="flex items-center gap-3 p-4 border-t border-neutral-100">
                        <UserButton afterSignOutUrl="/" />
                        <div className="flex flex-col">
                            <span className="text-sm font-semibold text-neutral-900">My Account</span>
                            <span className="text-xs text-neutral-500">Premium Plan</span>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Top Header */}
                <header className="flex items-center justify-between h-16 px-6 bg-white border-b border-neutral-200 lg:hidden">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                            <Mic2 className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold tracking-tight text-neutral-900">ECHOES</span>
                    </div>
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="p-2 text-neutral-500 hover:text-neutral-900 lg:hidden"
                    >
                        {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </header>

                {/* Page Content */}
                <div className="flex-1 overflow-y-auto p-6 lg:p-10">
                    <div className="max-w-6xl mx-auto">
                        {children}
                    </div>
                </div>
            </main>

            {/* FAB for Recording on Mobile */}
            <Link
                href="/record"
                className="fixed bottom-6 right-6 lg:hidden w-14 h-14 bg-indigo-600 rounded-full flex items-center justify-center shadow-lg shadow-indigo-200 text-white active:scale-95 transition-transform"
            >
                <PlusCircle className="w-8 h-8" />
            </Link>
        </div>
    )
}
