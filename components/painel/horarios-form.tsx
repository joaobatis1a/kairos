"use client"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { salvarHorarios, type HorariosConfig } from "@/app/actions/config"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { Loader2, Plus, Save, X } from "lucide-react"

const DIAS = [
  { num: 0, label: "Dom" },
  { num: 1, label: "Seg" },
  { num: 2, label: "Ter" },
  { num: 3, label: "Qua" },
  { num: 4, label: "Qui" },
  { num: 5, label: "Sex" },
  { num: 6, label: "Sáb" },
]

export function HorariosForm({ config }: { config: HorariosConfig }) {
  const [dias, setDias] = useState<number[]>(config.dias_abertos)
  const [horarios, setHorarios] = useState<string[]>([...config.horarios].sort())
  const [novoHorario, setNovoHorario] = useState("")
  const [pending, startTransition] = useTransition()

  function toggleDia(num: number) {
    setDias((d) => d.includes(num) ? d.filter((x) => x !== num) : [...d, num].sort())
  }

  function adicionarHorario() {
    const h = novoHorario.trim()
    if (!h.match(/^\d{2}:\d{2}$/)) { toast.error("Use o formato HH:MM"); return }
    if (horarios.includes(h)) { toast.error("Horário já existe."); return }
    setHorarios((hs) => [...hs, h].sort())
    setNovoHorario("")
  }

  function removerHorario(h: string) {
    setHorarios((hs) => hs.filter((x) => x !== h))
  }

  function salvar() {
    startTransition(async () => {
      const res = await salvarHorarios({ dias_abertos: dias, horarios })
      if (res.ok) toast.success("Horários salvos!")
      else toast.error(res.error ?? "Erro ao salvar.")
    })
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Dias */}
      <div>
        <p className="mb-2 text-sm font-medium">Dias de funcionamento</p>
        <div className="flex flex-wrap gap-2">
          {DIAS.map((d) => (
            <button
              key={d.num}
              onClick={() => toggleDia(d.num)}
              className={cn(
                "rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors",
                dias.includes(d.num)
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border text-muted-foreground hover:border-primary/50",
              )}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>

      {/* Horários */}
      <div>
        <p className="mb-2 text-sm font-medium">Horários disponíveis</p>
        <div className="mb-3 flex flex-wrap gap-2">
          {horarios.map((h) => (
            <span
              key={h}
              className="flex items-center gap-1 rounded-md border border-border bg-muted/40 px-2.5 py-1 text-sm"
            >
              {h}
              <button onClick={() => removerHorario(h)} className="text-muted-foreground hover:text-destructive">
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <Input
            value={novoHorario}
            onChange={(e) => setNovoHorario(e.target.value)}
            placeholder="HH:MM"
            className="w-28"
            onKeyDown={(e) => e.key === "Enter" && adicionarHorario()}
          />
          <Button variant="outline" size="sm" onClick={adicionarHorario}>
            <Plus className="h-4 w-4" /> Adicionar
          </Button>
        </div>
      </div>

      <Button onClick={salvar} disabled={pending} className="self-end">
        {pending ? <><Loader2 className="h-4 w-4 animate-spin" /> Salvando...</> : <><Save className="h-4 w-4" /> Salvar</>}
      </Button>
    </div>
  )
}
