"use client"

import Image from "next/image"
import { Package, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { formatarPreco } from "@/lib/format"
import type { ProdutoDb } from "@/app/actions/config"

/**
 * Cartão de produto — igual em espírito ao de serviço, mas sem duração nem
 * "Agendar": a venda é presencial, então o CTA é só puxar assunto no WhatsApp
 * (quando a barbearia tem um número cadastrado).
 */
export function ProdutoCard({ produto, whatsapp }: { produto: ProdutoDb; whatsapp?: string }) {
  const linkWhatsapp = whatsapp
    ? `https://wa.me/${whatsapp}?text=${encodeURIComponent(`Olá! Vi o produto "${produto.nome}" na vitrine e queria saber mais.`)}`
    : null

  return (
    <div className="surgir-suave cartao-interativo group flex flex-col overflow-hidden rounded-2xl border border-border bg-card hover:border-primary/50">
      <div className="flex aspect-square items-center justify-center overflow-hidden bg-muted/40">
        {produto.foto_url ? (
          <Image
            src={produto.foto_url}
            alt={produto.nome}
            width={320}
            height={320}
            unoptimized
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <Package className="h-10 w-10 text-muted-foreground/50" />
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="min-w-0 text-pretty font-serif text-lg font-semibold leading-tight">{produto.nome}</h3>
          <span className="texto-dourado shrink-0 font-serif text-lg font-bold tabular-nums">
            {formatarPreco(produto.preco)}
          </span>
        </div>

        {produto.descricao && (
          <p className="flex-1 text-sm leading-relaxed text-muted-foreground">{produto.descricao}</p>
        )}

        {linkWhatsapp && (
          <Button asChild size="sm" variant="outline" className="mt-2 rounded-full">
            <a href={linkWhatsapp} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="h-4 w-4" />
              Perguntar
            </a>
          </Button>
        )}
      </div>
    </div>
  )
}
