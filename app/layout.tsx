import { Analytics } from '@vercel/analytics/next'
import type { Metadata } from 'next'
import { Geist_Mono, Barlow, Big_Shoulders } from 'next/font/google'
import { Toaster } from '@/components/ui/sonner'
import { ThemeProvider } from '@/components/theme-provider'
import { MotionProvider } from '@/components/motion-provider'
import { PwaRegister } from '@/components/pwa-register'
import { DEMO_MODE } from '@/lib/demo'
import './globals.css'

/**
 * Tipografia da marca (escolhida pelo dono entre 5 opções):
 * - Barlow: corpo e títulos do sistema. Grotesca inspirada em placas e
 *   sinalização, legível em interface e com itálico de verdade.
 * - Big Shoulders (Display): títulos de efeito, condensada de letreiro de rua,
 *   usada em caixa alta.
 */
const barlow = Barlow({
  variable: '--font-barlow',
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
})
// Família variável com eixo de tamanho óptico: em título grande ela assume
// sozinha o desenho "Display" (font-optical-sizing: auto).
const bigShoulders = Big_Shoulders({
  variable: '--font-big-shoulders',
  subsets: ['latin', 'latin-ext'],
  axes: ['opsz'],
})
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
      className={`${barlow.variable} ${bigShoulders.variable} ${geistMono.variable}`}
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
