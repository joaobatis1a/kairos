"use client"

import { useState, useTransition } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { salvarBarbeariaConfig, type BarbeariaConfig } from "@/app/actions/config"
import { toast } from "sonner"
import { Loader2, Save } from "lucide-react"

export function ConfigGeralForm({ config }: { config: BarbeariaConfig }) {
  const [dados, setDados] = useState(config)
  const [pending, startTransition] = useTransition()

  function set(campo: keyof BarbeariaConfig) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setDados((d) => ({ ...d, [campo]: e.target.value }))
  }

  function salvar() {
    startTransition(async () => {
      const res = await salvarBarbeariaConfig(dados)
      if (res.ok) toast.success("Informações salvas!")
      else toast.error(res.error ?? "Erro ao salvar.")
    })
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-2">
        <Label>Nome da barbearia</Label>
        <Input value={dados.nome} onChange={set("nome")} />
      </div>
      <div className="grid gap-2">
        <Label>Slogan</Label>
        <Input value={dados.slogan} onChange={set("slogan")} placeholder="Ex: Tradição e estilo em cada corte" />
      </div>
      <div className="grid gap-2">
        <Label>Descrição</Label>
        <Textarea value={dados.descricao} onChange={set("descricao")} rows={3} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="grid gap-2">
          <Label>Telefone</Label>
          <Input value={dados.telefone} onChange={set("telefone")} placeholder="(11) 99999-9999" />
        </div>
        <div className="grid gap-2">
          <Label>WhatsApp (só números)</Label>
          <Input value={dados.whatsapp} onChange={set("whatsapp")} placeholder="5511999999999" />
        </div>
      </div>
      <div className="grid gap-2">
        <Label>Endereço</Label>
        <Input value={dados.endereco} onChange={set("endereco")} />
      </div>
      <div className="grid gap-2">
        <Label>Link Google Maps</Label>
        <Input value={dados.maps_url} onChange={set("maps_url")} placeholder="https://maps.google.com/..." />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="grid gap-2">
          <Label>Instagram (@ + nome)</Label>
          <Input value={dados.instagram} onChange={set("instagram")} placeholder="@suabarbearia" />
        </div>
        <div className="grid gap-2">
          <Label>Link do Instagram</Label>
          <Input value={dados.instagram_url} onChange={set("instagram_url")} placeholder="https://instagram.com/..." />
        </div>
      </div>
      <Button onClick={salvar} disabled={pending} className="self-end">
        {pending ? <><Loader2 className="h-4 w-4 animate-spin" /> Salvando...</> : <><Save className="h-4 w-4" /> Salvar</>}
      </Button>
    </div>
  )
}
