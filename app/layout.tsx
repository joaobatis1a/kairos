import { Analytics } from '@vercel/analytics/next'
import type { Metadata } from 'next'
import { Geist_Mono, Jost, Cormorant, Cinzel } from 'next/font/google'
import { Toaster } from '@/components/ui/sonner'
import { ThemeProvider } from '@/components/theme-provider'
import { MotionProvider } from '@/components/motion-provider'
import { PwaRegister } from '@/components/pwa-register'
import { DEMO_MODE } from '@/lib/demo'
import './globals.css'

/**
 * Tipografia da marca, pensada pro universo da barbearia:
 * - Jost: corpo e títulos do sistema. Geométrica herdeira da Futura, a letra
 *   dos letreiros e cartazes de barbearia clássica, e legível em interface.
 * - Cormorant: títulos grandes e itálicos de efeito. Serifa de traço fino
 *   como fio de navalha, com números alinhados só onde pedimos.
 * - Cinzel: capitulares romanas pro letreiro e o nome, como letra gravada
 *   em folha de ouro (e conversa com a origem grega do nome).
 */
const jost = Jost({ variable: '--font-jost', subsets: ['latin', 'latin-ext'] })
const cormorant = Cormorant({
  variable: '--font-cormorant',
  subsets: ['latin', 'latin-ext'],
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
})
const cinzel = Cinzel({ variable: '--font-cinzel', subsets: ['latin', 'latin-ext'], weight: ['400', '500', '600'] })
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] })

export const metadata: Metadata = {
  title: DEMO_MODE ? 'Kairos: demonstração' : 'Kairos',
  description: 'Agendamento online pros seus clientes e um painel completo pra gerenciar equipe, horários e faturamento da sua barbearia.',
  appleWebApp: { capable: true, title: 'Kairos', statusBarStyle: 'black-translucent' },
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="pt-BR"
      suppressHydrationWarning
      className={`${jost.variable} ${cormorant.variable} ${cinzel.variable} ${geistMono.variable}`}
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
