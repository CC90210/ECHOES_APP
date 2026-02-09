import { ClerkProvider } from '@clerk/nextjs'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'ECHOES - Voice Legacy Platform',
  description: 'Your voice deserves to be heard. Not just today — forever.',
}

export const dynamic = 'force-dynamic'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY

  if (!publishableKey) {
    return (
      <html lang="en">
        <body className={inter.className}>
          <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white p-4">
            <div className="max-w-md text-center space-y-4">
              <h1 className="text-3xl font-bold text-red-500">Configuration Error</h1>
              <p className="text-lg">
                The <code className="bg-slate-800 px-2 py-1 rounded">NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY</code> environment variable is missing.
              </p>
              <p className="text-gray-400">
                Please add this key to your Vercel Project Settings to enable authentication.
              </p>
            </div>
          </div>
        </body>
      </html>
    )
  }

  return (
    <ClerkProvider publishableKey={publishableKey}>
      <html lang="en" suppressHydrationWarning>
        <body className={`${inter.className} min-h-screen bg-neutral-50 antialiased`}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}
