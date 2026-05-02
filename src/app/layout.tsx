import type { Metadata } from 'next'
import { Sora, Outfit } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'

const sora = Sora({
  subsets: ['latin'],
  variable: '--font-sora',
  display: 'swap',
})

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'CREAVO — Criativos UGC em Segundos',
  description: 'De uma imagem a um criativo que converte — em 30 segundos. Crie vídeos e imagens UGC para anúncios com IA.',
  keywords: ['UGC', 'criativos', 'anúncios', 'vídeo', 'IA', 'marketing digital'],
  authors: [{ name: 'CREAVO' }],
  openGraph: {
    title: 'CREAVO — Criativos UGC em Segundos',
    description: 'De uma imagem a um criativo que converte — em 30 segundos.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body
        className={`${sora.variable} ${outfit.variable} font-sans antialiased`}
      >
        <TooltipProvider>
          {children}
          <Toaster position="bottom-right" />
        </TooltipProvider>
      </body>
    </html>
  )
}
