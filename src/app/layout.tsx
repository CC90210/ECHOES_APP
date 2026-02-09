import { ClerkProvider } from '@clerk/nextjs'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'ECHOES - Voice Legacy Platform',
  description: 'Your voice deserves to be heard. Not just today — forever.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || "pk_test_placeholder"}>
      <html lang="en" suppressHydrationWarning>
        <body className={`${inter.className} min-h-screen bg-neutral-50 antialiased`}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}
