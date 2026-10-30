import { Abertura } from "@/components/landing/abertura"
import { Cabecalho } from "@/components/landing/cabecalho"
import { Hero } from "@/components/landing/hero"
import { Letreiro } from "@/components/landing/letreiro"
import { ONome } from "@/components/landing/o-nome"
import { PorDentro } from "@/components/landing/por-dentro"
import { Tabela } from "@/components/landing/tabela"
import { Comandas } from "@/components/landing/comandas"
import { Perguntas } from "@/components/landing/perguntas"
import { Aberto } from "@/components/landing/aberto"
import { Rodape } from "@/components/landing/rodape"

/**
 * A landing é uma barbearia de alto padrão à noite: luminária acesa, quadro
 * de horários, letreiro em folha de ouro, espelho, tabela na parede,
 * comandas no balcão e a placa de "aberto" na porta.
 */
export function KairosLanding() {
  return (
    <div className="kairos-noite relative min-h-screen font-sans">
      <Abertura />
      <div className="grao" aria-hidden />
      <Cabecalho />
      <main id="conteudo" tabIndex={-1}>
        <Hero />
        <Letreiro />
        <ONome />
        <PorDentro />
        <Tabela />
        <Comandas />
        <Perguntas />
        <Aberto />
      </main>
      <Rodape />
    </div>
  )
}
