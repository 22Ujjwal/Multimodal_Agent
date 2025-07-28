import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AVEN - The Future of Banking',
  description: 'AVEN is building the future of banking. Join us in creating a more inclusive, transparent, and intelligent financial system.',
  keywords: 'AVEN, banking, fintech, digital banking, AI, financial services',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
