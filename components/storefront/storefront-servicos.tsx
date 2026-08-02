"use client"

import { ServicoCard } from "@/components/storefront/servico-card"
import type { ServicoDb } from "@/app/actions/config"

export function StorefrontServicos({
  servicos,
  onAgendar,
}: {
  servicos: ServicoDb[]
  onAgendar: (servicoId?: string) => void
}) {
  if (servicos.length === 0) return null

  return (
    <section id="servicos" className="mx-auto max-w-5xl scroll-mt-24 px-6 py-20 md:py-24">
      <h2 className="font-serif text-[clamp(1.75rem,4vw,2.5rem)] font-semibold tracking-[-0.02em]">
        Serviços e preços
      </h2>
      <p className="mt-2 text-muted-foreground">Escolha o serviço e marque o seu horário.</p>

      <div className="mt-10 flex flex-wrap gap-4 [&>*]:min-w-[min(100%,17rem)] [&>*]:flex-1">
        {servicos.map((s, i) => (
          <ServicoCard key={s.id} servico={s} indice={i} onAgendar={() => onAgendar(s.id)} />
        ))}
      </div>
    </section>
  )
}
