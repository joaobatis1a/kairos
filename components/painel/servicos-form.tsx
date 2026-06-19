"use client"

import { useState, useTransition } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog"
import {
  adicionarServico, editarServico, excluirServico, type ServicoDb,
} from "@/app/actions/config"
import { toast } from "sonner"
import { Plus, Pencil, Trash2, Loader2, Scissors } from "lucide-react"

function formatarPreco(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
}

type FormDados = { nome: string; descricao: string; preco: string; duracao_min: string }
const formVazio: FormDados = { nome: "", descricao: "", preco: "", duracao_min: "30" }

export function ServicosForm({ servicos }: { servicos: ServicoDb[] }) {
  const [lista, setLista] = useState(servicos)
  const [modalAberto, setModalAberto] = useState(false)
  const [editando, setEditando] = useState<ServicoDb | null>(null)
  const [form, setForm] = useState<FormDados>(formVazio)
  const [pending, startTransition] = useTransition()

  function abrirAdicionar() {
    setEditando(null)
    setForm(formVazio)
    setModalAberto(true)
  }

  function abrirEditar(s: ServicoDb) {
    setEditando(s)
    setForm({
      nome: s.nome,
      descricao: s.descricao,
      preco: String(s.preco),
      duracao_min: String(s.duracao_min),
    })
    setModalAberto(true)
  }

  function set(campo: keyof FormDados) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [campo]: e.target.value }))
  }

  function salvar() {
    const dados = {
      nome: form.nome.trim(),
      descricao: form.descricao.trim(),
      preco: parseFloat(form.preco.replace(",", ".")),
      duracao_min: parseInt(form.duracao_min),
    }
    if (!dados.nome || isNaN(dados.preco)) {
      toast.error("Preencha nome e preço.")
      return
    }

    startTransition(async () => {
      if (editando) {
        const res = await editarServico(editando.id, dados)
        if (res.ok) {
          setLista((l) => l.map((s) => s.id === editando.id ? { ...s, ...dados } : s))
          toast.success("Serviço atualizado!")
          setModalAberto(false)
        } else toast.error(res.error ?? "Erro ao salvar.")
      } else {
        const res = await adicionarServico(dados)
        if (res.ok) {
          toast.success("Serviço adicionado! Recarregando...")
          setTimeout(() => window.location.reload(), 800)
        } else toast.error(res.error ?? "Erro ao adicionar.")
      }
    })
  }

  function excluir(id: string) {
    if (!confirm("Excluir este serviço?")) return
    startTransition(async () => {
      const res = await excluirServico(id)
      if (res.ok) {
        setLista((l) => l.filter((s) => s.id !== id))
        toast.success("Serviço removido.")
      } else toast.error(res.error ?? "Erro ao excluir.")
    })
  }

  return (
    <div className="flex flex-col gap-3">
      {lista.map((s) => (
        <div
          key={s.id}
          className="flex items-center justify-between gap-3 rounded-lg border border-border p-3"
        >
          <div className="flex items-start gap-3 min-w-0">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
              <Scissors className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <p className="font-medium truncate">{s.nome}</p>
              <p className="text-xs text-muted-foreground">{s.duracao_min} min · {formatarPreco(s.preco)}</p>
            </div>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => abrirEditar(s)}>
              <Pencil className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => excluir(s.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}

      <Button variant="outline" className="self-start" onClick={abrirAdicionar}>
        <Plus className="h-4 w-4" /> Adicionar serviço
      </Button>

      <Dialog open={modalAberto} onOpenChange={setModalAberto}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-serif">{editando ? "Editar serviço" : "Novo serviço"}</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-2">
            <div className="grid gap-2">
              <Label>Nome</Label>
              <Input value={form.nome} onChange={set("nome")} placeholder="Ex: Corte + Barba" />
            </div>
            <div className="grid gap-2">
              <Label>Descrição</Label>
              <Textarea value={form.descricao} onChange={set("descricao")} rows={2} placeholder="Breve descrição do serviço" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2">
                <Label>Preço (R$)</Label>
                <Input value={form.preco} onChange={set("preco")} placeholder="45,00" inputMode="decimal" />
              </div>
              <div className="grid gap-2">
                <Label>Duração (min)</Label>
                <Input value={form.duracao_min} onChange={set("duracao_min")} placeholder="30" inputMode="numeric" />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalAberto(false)}>Cancelar</Button>
            <Button onClick={salvar} disabled={pending}>
              {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Salvar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
