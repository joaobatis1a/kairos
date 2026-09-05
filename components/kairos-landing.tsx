import { LandingHeader } from "@/components/landing/landing-header"
import { HeroSection } from "@/components/landing/hero-section"
import { ManifestoSection } from "@/components/landing/manifesto-section"
import { SistemaSection } from "@/components/landing/sistema-section"
import { RecursosSection } from "@/components/landing/recursos-section"
import { ComoFuncionaSection } from "@/components/landing/como-funciona-section"
import { FinalCtaSection } from "@/components/landing/final-cta-section"
import { LandingFooter } from "@/components/landing/landing-footer"
import { SectionDivider } from "@/components/landing/section-divider"

export function KairosLanding() {
  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <LandingHeader />
      <main id="conteudo" tabIndex={-1}>
        <HeroSection />
        <SectionDivider />
        <ManifestoSection />
        <SistemaSection />
        <RecursosSection />
        <ComoFuncionaSection />
        <SectionDivider />
        <FinalCtaSection />
      </main>
      <LandingFooter />
    </div>
  )
}
