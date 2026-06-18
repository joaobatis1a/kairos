"use client"

import { useState, useTransition } from "react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { alternarAtendeBarbeiro } from "@/app/actions/equipe"
import { toast } from "sonner"
import { Scissors } from "lucide-react"

export function ToggleAtendeBarbeiro({ atende }: { atende: boolean }) {
  const [ativo, setAtivo] = useState(atende)
  const [pending, startTransition] = useTransition()

  function handleChange(valor: boolean) {
    setAtivo(valor)
    startTransition(async () => {
      const res = await alternarAtendeBarbeiro(valor)
      if (!res.ok) {
        setAtivo(!valor)
        toast.error(res.error ?? "Erro ao salvar.")
      } else {
        toast.success(valor ? "Você agora aparece como barbeiro." : "Você não aparece mais como barbeiro.")
      }
    })
  }

  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/15 text-primary">
          <Scissors className="h-4 w-4" />
        </div>
        <div>
          <Label htmlFor="atende-barbeiro" className="font-medium cursor-pointer">
            Atender como barbeiro
          </Label>
          <p className="text-xs text-muted-foreground">
            {ativo ? "Você aparece disponível para agendamentos" : "Você não aparece para agendamentos"}
          </p>
        </div>
      </div>
      <Switch
        id="atende-barbeiro"
        checked={ativo}
        onCheckedChange={handleChange}
        disabled={pending}
      />
    </div>
  )
}
