import { Analytics } from '@vercel/analytics/next'
import type { Metadata } from 'next'
import { Geist_Mono, Nunito, Fredoka, Bodoni_Moda } from 'next/font/google'
import { Toaster } from '@/components/ui/sonner'
import { ThemeProvider } from '@/components/theme-provider'
import { MotionProvider } from '@/components/motion-provider'
import { PwaRegister } from '@/components/pwa-register'
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
/**
 * Fonte de destaque só pra palavras de efeito dentro de títulos da landing
 * de vendas (`<em className="font-accent italic">`) — itálico de verdade
 * (Fredoka não tem, virava itálico sintético feio). Didona de alto
 * contraste: o traço fino/grosso lembra o fio de uma navalha, sem cair no
 * combo clichê "serifada + creme + terracota".
 */
const bodoniModa = Bodoni_Moda({
  variable: '--font-bodoni',
  subsets: ['latin', 'latin-ext'],
  weight: ['600'],
  style: ['italic'],
})

export const metadata: Metadata = {
  title: 'kairos | Sistema de agendamento para barbearias',
  description: 'Agendamento online pros seus clientes e um painel completo pra gerenciar equipe, horários e faturamento da sua barbearia.',
  appleWebApp: { capable: true, title: 'kairos', statusBarStyle: 'black-translucent' },
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="pt-BR"
      suppressHydrationWarning
      className={`${nunito.variable} ${geistMono.variable} ${fredoka.variable} ${bodoniModa.variable}`}
    >
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
          <PwaRegister />
          {process.env.NODE_ENV === 'production' && <Analytics />}
        </ThemeProvider>
      </body>
    </html>
  )
}
