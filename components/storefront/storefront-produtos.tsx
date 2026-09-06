"use client"

import { ProdutoCard } from "@/components/storefront/produto-card"
import type { ProdutoDb } from "@/app/actions/config"

export function StorefrontProdutos({
  produtos,
  whatsapp,
}: {
  produtos: ProdutoDb[]
  whatsapp?: string
}) {
  if (produtos.length === 0) return null

  return (
    <section id="produtos" className="mx-auto max-w-5xl scroll-mt-24 px-6 py-20 md:py-24">
      <h2 className="font-serif text-[clamp(1.75rem,4vw,2.5rem)] font-semibold tracking-[-0.02em]">
        Produtos à venda
      </h2>
      <p className="mt-2 text-muted-foreground">Disponíveis para compra na barbearia.</p>

      <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {produtos.map((p) => (
          <ProdutoCard key={p.id} produto={p} whatsapp={whatsapp} />
        ))}
      </div>
    </section>
  )
}
