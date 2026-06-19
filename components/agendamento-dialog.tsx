"use client"

import { useState, useEffect, useTransition } from "react"
import { createClient } from "@/lib/supabase/client"
import { formatarPreco } from "@/config/barbearia"
import type { ServicoDb, HorariosConfig } from "@/app/actions/config"
import { getDiasDisponiveis, formatarDataExtenso } from "@/lib/datas"
import { criarAgendamento, getHorariosOcupados } from "@/app/actions/agendamentos"
import type { Profile, FormaPagamento } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import {
  Scissors,
  User,
  CalendarDays,
  Clock,
  Check,
  ChevronLeft,
  Loader2,
  PartyPopper,
  Wallet,
  Banknote,
  CreditCard,
  Smartphone,
} from "lucide-react"

type Barbeiro = Pick<Profile, "id" | "nome">

type Props = {
  barbeiros: Barbeiro[]
  open: boolean
  onOpenChange: (open: boolean) => void
  servicoInicialId?: string
  servicos: ServicoDb[]
  horariosConfig: HorariosConfig
}

const diasTodos = getDiasDisponiveis(60)

const FORMAS_PAGAMENTO: {
  id: FormaPagamento
  label: string
  icon: React.ElementType
  desc: string
}[] = [
  { id: "pix", label: "PIX", icon: Smartphone, desc: "Transferência instantânea" },
  { id: "dinheiro", label: "Dinheiro", icon: Banknote, desc: "Pagamento em espécie" },
  { id: "debito", label: "Cartão de débito", icon: CreditCard, desc: "Débito na hora" },
  { id: "credito", label: "Cartão de crédito", icon: CreditCard, desc: "Crédito à vista ou parcelado" },
]

const LABELS_PAGAMENTO: Record<FormaPagamento, string> = {
  pix: "PIX",
  dinheiro: "Dinheiro",
  debito: "Cartão de débito",
  credito: "Cartão de crédito",
}

export function AgendamentoDialog({ barbeiros, open, onOpenChange, servicoInicialId, servicos, horariosConfig }: Props) {
  const [etapa, setEtapa] = useState(1)
  const [servicoId, setServicoId] = useState<string | null>(null)
  const [barbeiroId, setBarbeiroId] = useState<string | null>(null)
  const [data, setData] = useState<string | null>(null)
  const [horario, setHorario] = useState<string | null>(null)
  const [nome, setNome] = useState("")
  const [whatsapp, setWhatsapp] = useState("")
  const [obs, setObs] = useState("")
  const [formaPagamento, setFormaPagamento] = useState<FormaPagamento | null>(null)
  const [ocupados, setOcupados] = useState<string[]>([])
  const [carregandoHorarios, setCarregandoHorarios] = useState(false)
  const [pending, startTransition] = useTransition()
  const [concluido, setConcluido] = useState(false)

  // reinicia ao abrir
  useEffect(() => {
    if (open) {
      setEtapa(servicoInicialId ? 2 : 1)
      setServicoId(servicoInicialId ?? null)
      setBarbeiroId(null)
      setData(null)
      setHorario(null)
      setNome("")
      setWhatsapp("")
      setObs("")
      setFormaPagamento(null)
      setConcluido(false)
    }
  }, [open, servicoInicialId])

  // busca horários ocupados + realtime quando barbeiro e data estão definidos
  useEffect(() => {
    if (!barbeiroId || !data) return
    let ativo = true

    setCarregandoHorarios(true)
    getHorariosOcupados(barbeiroId, data).then((res) => {
      if (ativo) {
        setOcupados(res)
        setCarregandoHorarios(false)
      }
    })

    const supabase = createClient()
    const canal = supabase
      .channel(`disp-${barbeiroId}-${data}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "agendamentos" },
        () => {
          getHorariosOcupados(barbeiroId, data).then((res) => {
            if (ativo) setOcupados(res)
          })
        },
      )
      .subscribe()

    return () => {
      ativo = false
      supabase.removeChannel(canal)
    }
  }, [barbeiroId, data])

  const dias = diasTodos.filter((d) => {
    const diaSemana = new Date(d.value + "T12:00:00").getDay()
    return horariosConfig.dias_abertos.includes(diaSemana)
  })

  const servico = servicos.find((s) => s.id === servicoId)
  const barbeiro = barbeiros.find((b) => b.id === barbeiroId)

  function confirmar() {
    if (!servicoId || !barbeiroId || !data || !horario || !formaPagamento || !servico) return
    startTransition(async () => {
      const res = await criarAgendamento({
        clienteNome: nome,
        clienteWhatsapp: whatsapp,
        servicoId,
        servicoNome: servico.nome,
        servicoPreco: servico.preco,
        barbeiroId,
        data,
        horario,
        observacoes: obs,
        formaPagamento,
      })
      if (res.ok) {
        setConcluido(true)
      } else {
        toast.error(res.error ?? "Erro ao agendar")
        if (res.error?.includes("preenchido")) {
          setHorario(null)
          setEtapa(3)
        }
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg p-0 gap-0 overflow-hidden max-h-[90vh] flex flex-col">
        {concluido ? (
          <div className="flex flex-col items-center text-center gap-4 p-8">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/15 text-primary">
              <PartyPopper className="h-8 w-8" />
            </div>
            <DialogHeader className="gap-2">
              <DialogTitle className="font-serif text-2xl">Agendamento enviado!</DialogTitle>
              <DialogDescription className="text-base">
                {nome.split(" ")[0]}, seu horário foi reservado. Você receberá a confirmação em breve.
              </DialogDescription>
            </DialogHeader>
            <div className="w-full rounded-lg border border-border bg-muted/40 p-4 text-left text-sm">
              <Resumo
                servico={servico?.nome}
                preco={servico?.preco}
                barbeiro={barbeiro?.nome}
                data={data}
                horario={horario}
                formaPagamento={formaPagamento}
              />
            </div>
            <Button className="w-full" onClick={() => onOpenChange(false)}>
              Fechar
            </Button>
          </div>
        ) : (
          <>
            <DialogHeader className="border-b border-border p-5 pb-4">
              <DialogTitle className="font-serif text-xl">Agendar horário</DialogTitle>
              <DialogDescription className="sr-only">
                Siga as etapas para concluir seu agendamento
              </DialogDescription>
              <Stepper etapa={etapa} />
            </DialogHeader>

            <div className="flex-1 overflow-y-auto p-5">
              {/* Etapa 1: Serviço */}
              {etapa === 1 && (
                <div className="flex flex-col gap-3">
                  <p className="text-sm text-muted-foreground">Escolha o serviço desejado:</p>
                  {servicos.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => {
                        setServicoId(s.id)
                        setEtapa(2)
                      }}
                      className={cn(
                        "flex items-center justify-between gap-3 rounded-lg border p-4 text-left transition-colors hover:border-primary/60 hover:bg-muted/40",
                        servicoId === s.id ? "border-primary bg-muted/40" : "border-border",
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <Scissors className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                        <div>
                          <p className="font-medium leading-tight">{s.nome}</p>
                          <p className="text-sm text-muted-foreground">{s.descricao}</p>
                          <p className="mt-1 text-xs text-muted-foreground">{s.duracao_min} min</p>
                        </div>
                      </div>
                      <span className="shrink-0 font-semibold text-primary">
                        {formatarPreco(s.preco)}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {/* Etapa 2: Barbeiro */}
              {etapa === 2 && (
                <div className="flex flex-col gap-3">
                  <p className="text-sm text-muted-foreground">Escolha o profissional:</p>
                  {barbeiros.length === 0 && (
                    <p className="rounded-lg border border-border bg-muted/40 p-4 text-sm text-muted-foreground">
                      Nenhum barbeiro disponível no momento. Entre em contato pelo WhatsApp.
                    </p>
                  )}
                  {barbeiros.map((b) => (
                    <button
                      key={b.id}
                      onClick={() => {
                        setBarbeiroId(b.id)
                        setHorario(null)
                        setEtapa(3)
                      }}
                      className={cn(
                        "flex items-center gap-3 rounded-lg border p-4 text-left transition-colors hover:border-primary/60 hover:bg-muted/40",
                        barbeiroId === b.id ? "border-primary bg-muted/40" : "border-border",
                      )}
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/15 text-primary">
                        <User className="h-5 w-5" />
                      </div>
                      <span className="font-medium">{b.nome}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Etapa 3: Data e Horário */}
              {etapa === 3 && (
                <div className="flex flex-col gap-5">
                  <div>
                    <p className="mb-2 text-sm text-muted-foreground">Escolha o dia:</p>
                    <div className="flex gap-2 overflow-x-auto pb-2">
                      {dias.map((d) => (
                        <button
                          key={d.value}
                          onClick={() => {
                            setData(d.value)
                            setHorario(null)
                          }}
                          className={cn(
                            "flex min-w-16 shrink-0 flex-col items-center gap-0.5 rounded-lg border p-2.5 transition-colors",
                            data === d.value
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-border hover:border-primary/60",
                          )}
                        >
                          <span className="text-xs uppercase opacity-80">{d.diaSemana}</span>
                          <span className="text-sm font-semibold">{d.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {data && (
                    <div>
                      <p className="mb-2 text-sm text-muted-foreground">
                        Horários disponíveis:
                        {carregandoHorarios && (
                          <Loader2 className="ml-2 inline h-3 w-3 animate-spin" />
                        )}
                      </p>
                      <div className="grid grid-cols-4 gap-2">
                        {horariosConfig.horarios.sort().map((h) => {
                          const indisponivel = ocupados.includes(h)
                          return (
                            <button
                              key={h}
                              disabled={indisponivel}
                              onClick={() => setHorario(h)}
                              className={cn(
                                "rounded-md border py-2 text-sm font-medium transition-colors",
                                indisponivel
                                  ? "cursor-not-allowed border-border bg-muted/40 text-muted-foreground/40 line-through"
                                  : horario === h
                                    ? "border-primary bg-primary text-primary-foreground"
                                    : "border-border hover:border-primary/60",
                              )}
                            >
                              {h}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  <Button
                    disabled={!data || !horario}
                    onClick={() => setEtapa(4)}
                    className="w-full"
                  >
                    Continuar
                  </Button>
                </div>
              )}

              {/* Etapa 4: Forma de pagamento */}
              {etapa === 4 && (
                <div className="flex flex-col gap-3">
                  <p className="text-sm text-muted-foreground">Como prefere pagar?</p>
                  {FORMAS_PAGAMENTO.map((fp) => (
                    <button
                      key={fp.id}
                      onClick={() => setFormaPagamento(fp.id)}
                      className={cn(
                        "flex items-center gap-3 rounded-lg border p-4 text-left transition-colors hover:border-primary/60 hover:bg-muted/40",
                        formaPagamento === fp.id ? "border-primary bg-muted/40" : "border-border",
                      )}
                    >
                      <div className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-full transition-colors",
                        formaPagamento === fp.id ? "bg-primary text-primary-foreground" : "bg-primary/15 text-primary"
                      )}>
                        <fp.icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium leading-tight">{fp.label}</p>
                        <p className="text-sm text-muted-foreground">{fp.desc}</p>
                      </div>
                      {formaPagamento === fp.id && (
                        <Check className="ml-auto h-4 w-4 text-primary" />
                      )}
                    </button>
                  ))}
                  <Button
                    disabled={!formaPagamento}
                    onClick={() => setEtapa(5)}
                    className="w-full mt-2"
                  >
                    Continuar
                  </Button>
                </div>
              )}

              {/* Etapa 5: Dados do cliente */}
              {etapa === 5 && (
                <div className="flex flex-col gap-4">
                  <div className="rounded-lg border border-border bg-muted/40 p-4 text-sm">
                    <Resumo
                      servico={servico?.nome}
                      preco={servico?.preco}
                      barbeiro={barbeiro?.nome}
                      data={data}
                      horario={horario}
                      formaPagamento={formaPagamento}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="nome">Seu nome</Label>
                    <Input
                      id="nome"
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                      placeholder="Nome completo"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="whatsapp">WhatsApp</Label>
                    <Input
                      id="whatsapp"
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      placeholder="(11) 99999-9999"
                      inputMode="tel"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="obs">Observações (opcional)</Label>
                    <Input
                      id="obs"
                      value={obs}
                      onChange={(e) => setObs(e.target.value)}
                      placeholder="Algo que o barbeiro precise saber?"
                    />
                  </div>
                  <Button
                    disabled={pending || !nome.trim() || !whatsapp.trim()}
                    onClick={confirmar}
                    className="w-full"
                  >
                    {pending ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" /> Confirmando...
                      </>
                    ) : (
                      <>
                        <Check className="h-4 w-4" /> Confirmar agendamento
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>

            {/* rodapé navegação */}
            {etapa > 1 && (
              <div className="border-t border-border p-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setEtapa((e) => Math.max(1, e - 1))}
                  disabled={pending}
                >
                  <ChevronLeft className="h-4 w-4" /> Voltar
                </Button>
              </div>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}

function Stepper({ etapa }: { etapa: number }) {
  const steps = [
    { n: 1, icon: Scissors },
    { n: 2, icon: User },
    { n: 3, icon: CalendarDays },
    { n: 4, icon: Wallet },
    { n: 5, icon: Clock },
  ]
  return (
    <div className="flex items-center gap-1.5 pt-2">
      {steps.map((s, i) => (
        <div key={s.n} className="flex flex-1 items-center gap-1.5">
          <div
            className={cn(
              "flex h-7 w-7 items-center justify-center rounded-full text-xs transition-colors",
              etapa >= s.n
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground",
            )}
          >
            <s.icon className="h-3.5 w-3.5" />
          </div>
          {i < steps.length - 1 && (
            <div
              className={cn(
                "h-0.5 flex-1 rounded-full transition-colors",
                etapa > s.n ? "bg-primary" : "bg-muted",
              )}
            />
          )}
        </div>
      ))}
    </div>
  )
}

function Resumo({
  servico,
  preco,
  barbeiro,
  data,
  horario,
  formaPagamento,
}: {
  servico?: string
  preco?: number
  barbeiro?: string
  data?: string | null
  horario?: string | null
  formaPagamento?: FormaPagamento | null
}) {
  return (
    <dl className="flex flex-col gap-1.5">
      <div className="flex justify-between gap-2">
        <dt className="text-muted-foreground">Serviço</dt>
        <dd className="font-medium">{servico}</dd>
      </div>
      <div className="flex justify-between gap-2">
        <dt className="text-muted-foreground">Profissional</dt>
        <dd className="font-medium">{barbeiro}</dd>
      </div>
      <div className="flex justify-between gap-2">
        <dt className="text-muted-foreground">Data</dt>
        <dd className="font-medium capitalize">{data ? formatarDataExtenso(data) : "-"}</dd>
      </div>
      <div className="flex justify-between gap-2">
        <dt className="text-muted-foreground">Horário</dt>
        <dd className="font-medium">{horario}</dd>
      </div>
      {formaPagamento && (
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Pagamento</dt>
          <dd className="font-medium">{LABELS_PAGAMENTO[formaPagamento]}</dd>
        </div>
      )}
      {preco !== undefined && (
        <div className="mt-1 flex justify-between gap-2 border-t border-border pt-1.5">
          <dt className="text-muted-foreground">Valor</dt>
          <dd className="font-semibold text-primary">{formatarPreco(preco)}</dd>
        </div>
      )}
    </dl>
  )
}
