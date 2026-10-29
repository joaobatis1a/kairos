import { IntroCortina } from "@/components/landing/intro-cortina"
import { ProgressoRolagem } from "@/components/landing/progresso-rolagem"
import { LandingHeader } from "@/components/landing/landing-header"
import { HeroSection } from "@/components/landing/hero-section"
import { FaixaServicos } from "@/components/landing/faixa-servicos"
import { ManifestoSection } from "@/components/landing/manifesto-section"
import { SistemaSection } from "@/components/landing/sistema-section"
import { RecursosSection } from "@/components/landing/recursos-section"
import { ComoFuncionaSection } from "@/components/landing/como-funciona-section"
import { FinalCtaSection } from "@/components/landing/final-cta-section"
import { LandingFooter } from "@/components/landing/landing-footer"

export function KairosLanding() {
  return (
    <div className="landing-tipo relative min-h-screen bg-background text-foreground">
      <IntroCortina />
      <ProgressoRolagem />
      <LandingHeader />
      <main id="conteudo" tabIndex={-1}>
        <HeroSection />
        <FaixaServicos />
        <ManifestoSection />
        <SistemaSection />
        <RecursosSection />
        <ComoFuncionaSection />
        <FinalCtaSection />
      </main>
      <LandingFooter />
    </div>
  )
}
