"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { SECOES_CONTA } from "@/components/conta/menu-conta"
import { ArrowLeft } from "lucide-react"

/**
 * Barra das páginas internas da conta (/conta/*).
 *
 * O checklist de seções só existe no chip do storefront — aqui dentro, uma
 * vez que você já entrou numa opção, a barra é só título + voltar. Repetir
 * o menu aqui era um segundo seletor de seção competindo com o primeiro.
 */
export function ContaNav({
  barbearia,
}: {
  barbearia: { nome: string; slug: string } | null
}) {
  const pathname = usePathname()
  const secao = SECOES_CONTA.find((s) => s.href === pathname)

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-4xl items-center gap-3 px-4 md:px-6">
        <Link
          href={barbearia ? `/b/${barbearia.slug}` : "/"}
          aria-label={barbearia ? `Voltar para ${barbearia.nome}` : "Voltar"}
          title={barbearia ? `Voltar para ${barbearia.nome}` : "Voltar"}
          className="group inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <ArrowLeft
            className="h-5 w-5 transition-transform duration-200 group-hover:-translate-x-0.5"
            aria-hidden
          />
        </Link>
        <h1 className="truncate font-serif text-lg font-semibold">
          {secao?.label ?? "Minha conta"}
        </h1>
      </div>
    </header>
  )
}
