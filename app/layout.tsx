import type { Metadata } from 'next'
import { Space_Mono, Lora } from 'next/font/google'
import './globals.css'

const spaceMono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-space-mono',
})

const lora = Lora({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-lora',
})

export const metadata: Metadata = {
  title: 'Field Guides — Curated Internet Journeys',
  description: 'Explore the internet intentionally. Curated journeys through strange, beautiful, and forgotten corners of the web.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${spaceMono.variable} ${lora.variable}`}>
      <body className="min-h-screen bg-parchment text-ink">
        {children}
      </body>
    </html>
  )
}
