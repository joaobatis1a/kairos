"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { AgendamentoDialog } from "@/components/agendamento-dialog"
import { barbearia, servicos, formatarPreco } from "@/config/barbearia"
import type { Profile } from "@/lib/types"
import {
  Scissors,
  Clock,
  MapPin,
  Phone,
  Globe,
  CalendarCheck,
  Star,
  Award,
  Coffee,
} from "lucide-react"

type Barbeiro = Pick<Profile, "id" | "nome">

export function LandingPage({ barbeiros }: { barbeiros: Barbeiro[] }) {
  const [open, setOpen] = useState(false)
  const [servicoInicial, setServicoInicial] = useState<string | undefined>(undefined)

  function abrirAgendamento(servicoId?: string) {
    setServicoInicial(servicoId)
    setOpen(true)
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="fixed top-0 z-40 w-full border-b border-border/60 bg-background/85 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Scissors className="h-5 w-5 text-primary" />
            <span className="font-serif text-lg font-semibold tracking-wide">
              {barbearia.nome}
            </span>
          </div>
          <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
            <a href="#servicos" className="transition-colors hover:text-foreground">
              Serviços
            </a>
            <a href="#sobre" className="transition-colors hover:text-foreground">
              Sobre
            </a>
            <a href="#contato" className="transition-colors hover:text-foreground">
              Contato
            </a>
          </nav>
          <Button size="sm" onClick={() => abrirAgendamento()}>
            <CalendarCheck className="h-4 w-4" /> Agendar
          </Button>
        </div>
      </header>

      {/* Hero */}
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden pt-16">
        <img
          src="/images/hero-barbearia.png"
          alt="Interior da barbearia"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/70 to-background" />
        <div className="relative mx-auto max-w-3xl px-4 text-center">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm text-primary">
            <Star className="h-3.5 w-3.5 fill-primary" /> {barbearia.slogan}
          </p>
          <h1 className="font-serif text-balance text-5xl font-bold leading-tight md:text-7xl">
            {barbearia.nome}
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">
            {barbearia.descricao}
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button size="lg" onClick={() => abrirAgendamento()}>
              <CalendarCheck className="h-5 w-5" /> Agendar meu horário
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="#servicos">Ver serviços</a>
            </Button>
          </div>
        </div>
      </section>

      {/* Diferenciais */}
      <section className="border-y border-border bg-card/40">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 py-12 sm:grid-cols-3">
          <Diferencial
            icon={Award}
            titulo="Profissionais experientes"
            texto="Barbeiros com técnica e atenção aos detalhes em cada corte."
          />
          <Diferencial
            icon={Clock}
            titulo="Agendamento online"
            texto="Escolha o dia, horário e profissional sem sair de casa."
          />
          <Diferencial
            icon={Coffee}
            titulo="Ambiente acolhedor"
            texto="Café por conta da casa e aquele atendimento de respeito."
          />
        </div>
      </section>

      {/* Serviços */}
      <section id="servicos" className="mx-auto max-w-6xl px-4 py-20">
        <div className="mb-12 text-center">
          <h2 className="font-serif text-4xl font-bold">Nossos Serviços</h2>
          <p className="mt-3 text-muted-foreground">
            Qualidade e tradição em cada atendimento.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {servicos.map((s) => (
            <div
              key={s.id}
              className="group flex flex-col rounded-xl border border-border bg-card p-6 transition-colors hover:border-primary/50"
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-primary/15 text-primary">
                <Scissors className="h-5 w-5" />
              </div>
              <h3 className="font-serif text-xl font-semibold">{s.nome}</h3>
              <p className="mt-1.5 flex-1 text-sm leading-relaxed text-muted-foreground">
                {s.descricao}
              </p>
              <div className="mt-5 flex items-center justify-between">
                <div>
                  <span className="text-2xl font-bold text-primary">
                    {formatarPreco(s.preco)}
                  </span>
                  <span className="ml-2 text-xs text-muted-foreground">{s.duracaoMin} min</span>
                </div>
                <Button size="sm" variant="secondary" onClick={() => abrirAgendamento(s.id)}>
                  Agendar
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Sobre */}
      <section id="sobre" className="border-y border-border bg-card/40">
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-4 py-20 md:grid-cols-2">
          <div className="overflow-hidden rounded-2xl border border-border">
            <img
              src="/images/barbeiro-trabalho.png"
              alt="Barbeiro trabalhando com navalha"
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <h2 className="font-serif text-4xl font-bold">Sobre a {barbearia.nome}</h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">{barbearia.descricao}</p>
            <ul className="mt-6 flex flex-col gap-3">
              {[
                "Atendimento personalizado para cada cliente",
                "Produtos premium e ferramentas profissionais",
                "Ambiente higienizado e confortável",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/15 text-primary">
                    <Star className="h-3 w-3 fill-primary" />
                  </span>
                  <span className="text-sm">{item}</span>
                </li>
              ))}
            </ul>
            <Button className="mt-8" onClick={() => abrirAgendamento()}>
              <CalendarCheck className="h-4 w-4" /> Agendar agora
            </Button>
          </div>
        </div>
      </section>

      {/* Contato / CTA */}
      <section id="contato" className="mx-auto max-w-6xl px-4 py-20">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <ContatoItem icon={MapPin} titulo="Endereço" texto={barbearia.endereco} href={barbearia.mapsUrl} acao="Como chegar" />
          <ContatoItem icon={Phone} titulo="WhatsApp" texto={barbearia.telefone} href={`https://wa.me/${barbearia.whatsapp}`} acao="Chamar no WhatsApp" />
          <ContatoItem icon={Globe} titulo="Instagram" texto={barbearia.instagram} href={barbearia.instagramUrl} acao="Seguir" />
        </div>
        <div className="mt-12 rounded-2xl border border-primary/30 bg-primary/10 p-10 text-center">
          <h2 className="font-serif text-3xl font-bold">Pronto para renovar o visual?</h2>
          <p className="mt-2 text-muted-foreground">
            Agende seu horário em menos de um minuto.
          </p>
          <Button size="lg" className="mt-6" onClick={() => abrirAgendamento()}>
            <CalendarCheck className="h-5 w-5" /> Agendar meu horário
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card/40">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 py-12 sm:grid-cols-3">
          <div>
            <div className="flex items-center gap-2">
              <Scissors className="h-5 w-5 text-primary" />
              <span className="font-serif text-lg font-semibold">{barbearia.nome}</span>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">{barbearia.slogan}</p>
          </div>
          <div>
            <h3 className="mb-3 font-semibold">Horário de funcionamento</h3>
            <ul className="flex flex-col gap-1.5 text-sm text-muted-foreground">
              {barbearia.funcionamento.map((f) => (
                <li key={f.dia} className="flex justify-between gap-4">
                  <span>{f.dia}</span>
                  <span>{f.horas}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="mb-3 font-semibold">Contato</h3>
            <ul className="flex flex-col gap-1.5 text-sm text-muted-foreground">
              <li>{barbearia.endereco}</li>
              <li>{barbearia.telefone}</li>
              <li>{barbearia.instagram}</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border py-5 text-center text-xs text-muted-foreground">
          <p>
            {barbearia.nome} · {new Date().getFullYear()} ·{" "}
            <a href="/auth/login" className="transition-colors hover:text-foreground">
              Área da equipe
            </a>
          </p>
        </div>
      </footer>

      <AgendamentoDialog
        barbeiros={barbeiros}
        open={open}
        onOpenChange={setOpen}
        servicoInicialId={servicoInicial}
      />
    </div>
  )
}

function Diferencial({
  icon: Icon,
  titulo,
  texto,
}: {
  icon: React.ElementType
  titulo: string
  texto: string
}) {
  return (
    <div className="flex flex-col items-center gap-2 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/15 text-primary">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="font-semibold">{titulo}</h3>
      <p className="text-sm text-muted-foreground">{texto}</p>
    </div>
  )
}

function ContatoItem({
  icon: Icon,
  titulo,
  texto,
  href,
  acao,
}: {
  icon: React.ElementType
  titulo: string
  texto: string
  href: string
  acao: string
}) {
  return (
    <div className="flex flex-col items-start gap-3 rounded-xl border border-border bg-card p-6">
      <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/15 text-primary">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <h3 className="font-semibold">{titulo}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{texto}</p>
      </div>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm font-medium text-primary transition-opacity hover:opacity-80"
      >
        {acao} →
      </a>
    </div>
  )
}
