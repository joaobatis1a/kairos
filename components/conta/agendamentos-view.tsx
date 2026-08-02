"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { formatarPreco } from "@/config/barbearia"
import type { ResumoCliente } from "@/app/actions/perfil-cliente"
import { Store, Clock, User, CalendarPlus, ArrowRight, History, Check, Hourglass } from "lucide-react"

const MESES = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"]
const DIAS = ["Domingo","Segunda","Terça","Quarta","Quinta","Sexta","Sábado"]

function quando(data: string) {
  const hoje = new Date(); hoje.setHours(0, 0, 0, 0)
  const alvo = new Date(data + "T12:00:00"); alvo.setHours(0, 0, 0, 0)
  const dias = Math.round((alvo.getTime() - hoje.getTime()) / 86_400_000)
  if (dias === 0) return "Hoje"
  if (dias === 1) return "Amanhã"
  if (dias < 7) return DIAS[alvo.getDay()]
  return `Em ${dias} dias`
}

function partes(data: string) {
  const [, mes, dia] = data.split("-")
  return { dia, mes: MESES[parseInt(mes) - 1] }
}

export function AgendamentosView({
  primeiroNome,
  resumo,
}: {
  primeiroNome: string
  resumo: ResumoCliente
}) {
  const { proximo } = resumo
  const principal = resumo.barbearias[0] ?? null
  const confirmado = proximo?.status === "confirmado"

  return (
    <div className="surgir flex flex-col gap-6">
      <div>
        <h1 className="font-serif text-3xl font-bold">Olá, {primeiroNome}</h1>
        <p className="mt-1 text-muted-foreground">
          {proximo
            ? `Seu próximo corte é ${quando(proximo.data).toLowerCase()}.`
            : "Nenhum horário marcado no momento."}
        </p>
      </div>

      {proximo ? (
        /* Cartão do próximo horário: a data à esquerda funciona como uma
           folha de calendário, e o "Hoje / Amanhã" responde a pergunta real
           mais rápido que a data crua. */
        <article className="overflow-hidden rounded-2xl border border-border bg-card">
          <div className="flex flex-wrap items-stretch">
            <div className="flex w-full items-center gap-4 border-b border-border bg-primary/[0.06] p-5 sm:w-auto sm:flex-col sm:justify-center sm:gap-1 sm:border-b-0 sm:border-r sm:px-8">
              <span className="font-serif text-4xl font-bold leading-none tabular-nums text-primary">
                {partes(proximo.data).dia}
              </span>
              <div className="sm:text-center">
                <p className="font-semibold uppercase tracking-wide text-primary">
                  {partes(proximo.data).mes}
                </p>
                <p className="text-sm text-muted-foreground">{quando(proximo.data)}</p>
              </div>
            </div>

            <div className="flex min-w-0 flex-1 flex-col justify-center gap-3 p-5 sm:p-6">
              <div>
                <h2 className="font-serif text-xl font-semibold">{proximo.servicoNome}</h2>
                <p className="mt-1 font-serif text-lg font-bold tabular-nums text-primary">
                  {formatarPreco(proximo.servicoPreco)}
                </p>
              </div>

              <dl className="flex flex-wrap gap-x-6 gap-y-1.5 text-sm">
                <div className="inline-flex items-center gap-2">
                  <dt className="sr-only">Horário</dt>
                  <Clock className="h-4 w-4 text-muted-foreground" aria-hidden />
                  <dd className="font-medium tabular-nums">{proximo.horario.slice(0, 5)}</dd>
                </div>
                <div className="inline-flex items-center gap-2">
                  <dt className="sr-only">Barbearia</dt>
                  <Store className="h-4 w-4 text-muted-foreground" aria-hidden />
                  <dd className="font-medium">{proximo.barbeariaNome}</dd>
                </div>
                {proximo.barbeiroNome && (
                  <div className="inline-flex items-center gap-2">
                    <dt className="sr-only">Profissional</dt>
                    <User className="h-4 w-4 text-muted-foreground" aria-hidden />
                    <dd className="font-medium">{proximo.barbeiroNome}</dd>
                  </div>
                )}
              </dl>

              <p
                className={`inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium ${
                  confirmado
                    ? "bg-emerald-500/15 text-emerald-400"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {confirmado ? (
                  <Check className="h-3.5 w-3.5" aria-hidden />
                ) : (
                  <Hourglass className="h-3.5 w-3.5" aria-hidden />
                )}
                {confirmado ? "Confirmado pela barbearia" : "Aguardando confirmação"}
              </p>
            </div>
          </div>
        </article>
      ) : (
        /* Estado vazio com AÇÃO, não instrução. A versão anterior mandava
           "abra o site da barbearia" — sendo que o sistema sabe qual é. */
        <article className="rounded-2xl border border-border bg-card p-8 text-center">
          <span
            className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/12 text-primary"
            aria-hidden
          >
            <CalendarPlus className="h-6 w-6" />
          </span>
          <h2 className="mt-4 font-serif text-xl font-semibold">Sem horário marcado</h2>
          {principal ? (
            <>
              <p className="mx-auto mt-1 max-w-sm text-muted-foreground">
                Marque seu próximo corte na {principal.nome}.
              </p>
              <Button asChild size="lg" className="mt-5 rounded-full px-7 font-bold">
                <Link href={`/b/${principal.slug}`}>
                  <CalendarPlus className="h-5 w-5" aria-hidden />
                  Agendar na {principal.nome}
                </Link>
              </Button>
            </>
          ) : (
            <p className="mx-auto mt-1 max-w-sm text-muted-foreground">
              Assim que você agendar em uma barbearia, o horário aparece aqui.
            </p>
          )}
        </article>
      )}

      {/* Atalhos — lista simples, sem cartão de número decorativo */}
      <div className="flex flex-col gap-2">
        {resumo.totalFinalizados > 0 && (
          <Link
            href="/conta/historico"
            className="group flex items-center gap-4 rounded-xl border border-border bg-card px-5 py-4 transition-colors hover:border-primary/40 hover:bg-muted/30"
          >
            <History className="h-5 w-5 shrink-0 text-muted-foreground" aria-hidden />
            <span className="min-w-0 flex-1">
              <span className="block font-semibold">Histórico</span>
              <span className="block text-sm text-muted-foreground">
                <span className="tabular-nums">{resumo.totalFinalizados}</span>{" "}
                {resumo.totalFinalizados === 1 ? "atendimento" : "atendimentos"}
              </span>
            </span>
            <ArrowRight
              className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary"
              aria-hidden
            />
          </Link>
        )}

        {proximo &&
          resumo.barbearias.map((b) => (
            <Link
              key={b.slug}
              href={`/b/${b.slug}`}
              className="group flex items-center gap-4 rounded-xl border border-border bg-card px-5 py-4 transition-colors hover:border-primary/40 hover:bg-muted/30"
            >
              <Store className="h-5 w-5 shrink-0 text-muted-foreground" aria-hidden />
              <span className="min-w-0 flex-1">
                <span className="block truncate font-semibold">{b.nome}</span>
                <span className="block text-sm text-muted-foreground">
                  Marcar outro horário
                </span>
              </span>
              <ArrowRight
                className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary"
                aria-hidden
              />
            </Link>
          ))}
      </div>
    </div>
  )
}
