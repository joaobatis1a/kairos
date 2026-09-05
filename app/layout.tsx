import { Analytics } from '@vercel/analytics/next'
import type { Metadata } from 'next'
import { Geist_Mono, Nunito, Fredoka } from 'next/font/google'
import { Toaster } from '@/components/ui/sonner'
import { ThemeProvider } from '@/components/theme-provider'
import { MotionProvider } from '@/components/motion-provider'
import './globals.css'

const nunito = Nunito({
  variable: '--font-nunito',
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '600', '700', '800'],
})
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] })
const fredoka = Fredoka({
  variable: '--font-fredoka',
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title: 'kairos | Sistema de agendamento para barbearias',
  description: 'Agendamento online pros seus clientes e um painel completo pra gerenciar equipe, horários e faturamento da sua barbearia.',
  icons: {
    icon: [
      { url: '/icon-light-32x32.png', media: '(prefers-color-scheme: light)' },
      { url: '/icon-dark-32x32.png', media: '(prefers-color-scheme: dark)' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning className={`${nunito.variable} ${geistMono.variable} ${fredoka.variable}`}>
      <body className="font-sans antialiased bg-background">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} storageKey="kairos-theme">
          {/* Fica invisível até receber foco pelo teclado: sem isso, quem navega
              por Tab precisa passar por toda a navegação em cada página. O
              destino #conteudo é o <main> de cada layout. */}
          <a
            href="#conteudo"
            className="sr-only rounded-lg bg-primary px-4 py-2 font-semibold text-primary-foreground focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100]"
          >
            Pular para o conteúdo
          </a>
          <MotionProvider>{children}</MotionProvider>
          <Toaster />
          {process.env.NODE_ENV === 'production' && <Analytics />}
        </ThemeProvider>
      </body>
    </html>
  )
}
