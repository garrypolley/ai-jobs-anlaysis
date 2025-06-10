import type { Metadata } from 'next'
import React from 'react'
import './globals.css'

export const metadata: Metadata = {
  title: 'AI Jobs Impact Analysis - Anthropic Economic Index',
  description: 'Comprehensive analysis of AI\'s impact on white-collar jobs using Anthropic\'s Economic Index data',
  keywords: 'AI, jobs, automation, augmentation, white collar, unemployment, economic impact',
  authors: [{ name: 'AI Jobs Analysis Tool' }],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen">
        <div className="min-h-screen">
          {children}
        </div>
      </body>
    </html>
  )
}