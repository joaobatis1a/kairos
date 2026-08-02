"use client"

import { MapPin, Phone, Globe, CalendarCheck, ArrowUpRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { BarbeariaConfig } from "@/app/actions/config"

export function StorefrontContato({
  config,
  onAgendar,
}: {
  config: BarbeariaConfig
  onAgendar: () => void
}) {
  const itens = [
    { icon: MapPin, titulo: "Endereço", texto: config.endereco, href: config.maps_url, acao: "Como chegar" },
    {
      icon: Phone,
      titulo: "WhatsApp",
      texto: config.telefone,
      href: config.whatsapp ? `https://wa.me/${config.whatsapp}` : "",
      acao: "Chamar no WhatsApp",
    },
    { icon: Globe, titulo: "Instagram", texto: config.instagram, href: config.instagram_url, acao: "Seguir" },
  ].filter((item) => item.texto)

  return (
    <section id="contato" className="mx-auto max-w-5xl scroll-mt-24 px-6 py-20 md:py-24">
      {/* "Onde estamos" era o título de uma lista que continha WhatsApp e
          Instagram — endereço é só um dos três. Agora o título diz o que a
          seção é de fato. */}
      <h2 className="font-serif text-[clamp(1.75rem,4vw,2.5rem)] font-semibold tracking-[-0.02em]">
        Fale com a gente
      </h2>
      <p className="mt-2 text-muted-foreground">Onde estamos e por onde nos chamar.</p>

      {itens.length > 0 && (
        <div className="mt-10 flex flex-wrap gap-4 [&>*]:min-w-[min(100%,15rem)] [&>*]:flex-1">
          {itens.map((item) => (
            <div key={item.titulo} className="cartao-interativo group rounded-2xl border border-border bg-card p-5 hover:border-primary/40">
              <item.icon className="h-5 w-5 text-primary transition-transform duration-300 group-hover:scale-110" aria-hidden />
              <p className="mt-3 font-semibold">{item.titulo}</p>
              <p className="mt-1 text-sm text-muted-foreground">{item.texto}</p>
              {item.href && (
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary underline-offset-4 hover:underline"
                >
                  {item.acao}
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="mt-12 rounded-3xl border border-border bg-card px-8 py-12 text-center">
        <h3 className="font-serif text-2xl font-semibold tracking-[-0.02em]">Pronto pra renovar o visual?</h3>
        <p className="mt-2 text-muted-foreground">Agende seu horário em menos de um minuto.</p>
        <Button size="lg" onClick={onAgendar} className="cta-dourado mt-6 rounded-full px-8 text-base font-bold">
          <CalendarCheck className="h-5 w-5" />
          Agendar meu horário
        </Button>
      </div>
    </section>
  )
}
