"use client"

import { useState } from "react"
import { AgendamentoDialog } from "@/components/agendamento-dialog"
import { StorefrontHeader } from "@/components/storefront/storefront-header"
import { StorefrontHero } from "@/components/storefront/storefront-hero"
import { StorefrontServicos } from "@/components/storefront/storefront-servicos"
import { StorefrontEquipe } from "@/components/storefront/storefront-equipe"
import { StorefrontSobre } from "@/components/storefront/storefront-sobre"
import { StorefrontContato } from "@/components/storefront/storefront-contato"
import { StorefrontFooter } from "@/components/storefront/storefront-footer"
import { BloqueioContaDialog } from "@/components/storefront/bloqueio-conta-dialog"
import type { Profile, Cliente } from "@/lib/types"
import type { BarbeariaConfig, ServicoDb, HorariosConfig } from "@/app/actions/config"
import type { BarbeiroVitrine } from "@/app/actions/agendamentos"

type Barbeiro = Pick<Profile, "id" | "nome">

export function LandingPage({
  companyId,
  barbeiros,
  barbeirosVitrine,
  cliente,
  isEquipe = false,
  config,
  servicos,
  horarios,
  statusAbertura,
}: {
  companyId: string
  barbeiros: Barbeiro[]
  barbeirosVitrine: BarbeiroVitrine[]
  cliente: Cliente | null
  isEquipe?: boolean
  config: BarbeariaConfig
  servicos: ServicoDb[]
  horarios: HorariosConfig
  statusAbertura: { aberto: boolean; texto: string }
}) {
  const [open, setOpen] = useState(false)
  const [bloqueioAberto, setBloqueioAberto] = useState(false)
  const [servicoInicial, setServicoInicial] = useState<string | undefined>(undefined)

  function abrirAgendamento(servicoId?: string) {
    if (!cliente) {
      setBloqueioAberto(true)
      return
    }
    setServicoInicial(servicoId)
    setOpen(true)
  }

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <StorefrontHeader
        nome={config.nome}
        logoUrl={config.logo_url}
        cliente={cliente}
        isEquipe={isEquipe}
        onAgendar={() => abrirAgendamento()}
      />

      <main id="conteudo" tabIndex={-1}>
        <StorefrontHero
          nome={config.nome}
          slogan={config.slogan}
          endereco={config.endereco}
          statusAbertura={statusAbertura}
          onAgendar={() => abrirAgendamento()}
        />
        <StorefrontServicos servicos={servicos} onAgendar={abrirAgendamento} />
        <StorefrontEquipe barbeiros={barbeirosVitrine} onAgendar={() => abrirAgendamento()} />
        <StorefrontSobre descricao={config.descricao} />
        <StorefrontContato config={config} onAgendar={() => abrirAgendamento()} />
      </main>

      <StorefrontFooter config={config} horarios={horarios} />

      <AgendamentoDialog
        companyId={companyId}
        barbeiros={barbeiros}
        cliente={cliente}
        open={open}
        onOpenChange={setOpen}
        servicoInicialId={servicoInicial}
        servicos={servicos}
        horariosConfig={horarios}
      />

      <BloqueioContaDialog open={bloqueioAberto} onOpenChange={setBloqueioAberto} />
    </div>
  )
}
