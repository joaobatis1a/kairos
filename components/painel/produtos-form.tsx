"use client"

import { useRef, useState, useTransition } from "react"
import Image from "next/image"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog"
import {
  adicionarProduto, editarProduto, excluirProduto, enviarFotoProduto, removerFotoProduto, type ProdutoDb,
} from "@/app/actions/config"
import { formatarPreco } from "@/lib/format"
import { toast } from "sonner"
import { Plus, Pencil, Trash2, Loader2, Package, Upload } from "lucide-react"

type FormDados = { nome: string; descricao: string; preco: string }
const formVazio: FormDados = { nome: "", descricao: "", preco: "" }

export function ProdutosForm({ produtos }: { produtos: ProdutoDb[] }) {
  const [lista, setLista] = useState(produtos)
  const [modalAberto, setModalAberto] = useState(false)
  const [editando, setEditando] = useState<ProdutoDb | null>(null)
  const [form, setForm] = useState<FormDados>(formVazio)
  const [foto, setFoto] = useState<File | null>(null)
  const [previa, setPrevia] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()
  const inputRef = useRef<HTMLInputElement>(null)

  function abrirAdicionar() {
    setEditando(null)
    setForm(formVazio)
    setFoto(null)
    setPrevia(null)
    setModalAberto(true)
  }

  function abrirEditar(p: ProdutoDb) {
    setEditando(p)
    setForm({ nome: p.nome, descricao: p.descricao, preco: String(p.preco) })
    setFoto(null)
    setPrevia(p.foto_url || null)
    setModalAberto(true)
  }

  function set(campo: keyof FormDados) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [campo]: e.target.value }))
  }

  function escolherFoto(e: React.ChangeEvent<HTMLInputElement>) {
    const arquivo = e.target.files?.[0]
    e.target.value = ""
    if (!arquivo) return
    setFoto(arquivo)
    setPrevia(URL.createObjectURL(arquivo))
  }

  async function enviarFotoSeHouver(id: string) {
    if (!foto) return
    const dados = new FormData()
    dados.set("foto", foto)
    const res = await enviarFotoProduto(id, dados)
    if (!res.ok) toast.error(res.error ?? "Produto salvo, mas a foto não foi enviada.")
  }

  function salvar() {
    const dados = {
      nome: form.nome.trim(),
      descricao: form.descricao.trim(),
      preco: parseFloat(form.preco.replace(",", ".")),
    }
    if (!dados.nome || isNaN(dados.preco)) {
      toast.error("Preencha nome e preço.")
      return
    }

    startTransition(async () => {
      if (editando) {
        const res = await editarProduto(editando.id, dados)
        if (!res.ok) {
          toast.error(res.error ?? "Erro ao salvar.")
          return
        }
        await enviarFotoSeHouver(editando.id)
        toast.success("Produto atualizado! Recarregando...")
        setTimeout(() => window.location.reload(), 800)
      } else {
        const res = await adicionarProduto(dados)
        if (!res.ok) {
          toast.error(res.error ?? "Erro ao adicionar.")
          return
        }
        await enviarFotoSeHouver(res.id)
        toast.success("Produto adicionado! Recarregando...")
        setTimeout(() => window.location.reload(), 800)
      }
    })
  }

  function excluir(id: string) {
    if (!confirm("Excluir este produto?")) return
    startTransition(async () => {
      const res = await excluirProduto(id)
      if (res.ok) {
        setLista((l) => l.filter((p) => p.id !== id))
        toast.success("Produto removido.")
      } else toast.error(res.error ?? "Erro ao excluir.")
    })
  }

  function removerFotoAtual() {
    setFoto(null)
    setPrevia(null)
    if (editando) {
      startTransition(async () => {
        const res = await removerFotoProduto(editando.id)
        if (!res.ok) toast.error(res.error ?? "Não foi possível remover a foto.")
      })
    }
  }

  return (
    <div className="flex flex-col gap-3">
      {lista.map((p) => (
        <div
          key={p.id}
          className="flex items-center justify-between gap-3 rounded-lg border border-border p-3"
        >
          <div className="flex items-start gap-3 min-w-0">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-primary/15 text-primary">
              {p.foto_url ? (
                <Image src={p.foto_url} alt="" width={36} height={36} className="h-full w-full object-cover" unoptimized />
              ) : (
                <Package className="h-4 w-4" />
              )}
            </div>
            <div className="min-w-0">
              <p className="font-medium truncate">{p.nome}</p>
              <p className="text-xs text-muted-foreground">{formatarPreco(p.preco)}</p>
            </div>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => abrirEditar(p)} aria-label={`Editar ${p.nome}`}>
              <Pencil className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => excluir(p.id)} aria-label={`Excluir ${p.nome}`}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}

      <Button variant="outline" className="self-start" onClick={abrirAdicionar}>
        <Plus className="h-4 w-4" /> Adicionar produto
      </Button>

      <Dialog open={modalAberto} onOpenChange={setModalAberto}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-serif">{editando ? "Editar produto" : "Novo produto"}</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-2">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border bg-muted/40">
                {previa ? (
                  <Image src={previa} alt="" width={64} height={64} className="h-full w-full object-cover" unoptimized />
                ) : (
                  <Package className="h-6 w-6 text-muted-foreground" />
                )}
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-xs text-muted-foreground">Foto do produto (opcional), até 2 MB.</p>
                <div className="flex gap-2">
                  <Button type="button" size="sm" variant="outline" onClick={() => inputRef.current?.click()}>
                    <Upload className="h-3.5 w-3.5" /> {previa ? "Trocar" : "Enviar"}
                  </Button>
                  {previa && (
                    <Button type="button" size="sm" variant="ghost" onClick={removerFotoAtual}>
                      <Trash2 className="h-3.5 w-3.5" /> Remover
                    </Button>
                  )}
                </div>
              </div>
              <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={escolherFoto} />
            </div>
            <div className="grid gap-2">
              <Label>Nome</Label>
              <Input value={form.nome} onChange={set("nome")} placeholder="Ex: Pomada modeladora" />
            </div>
            <div className="grid gap-2">
              <Label>Descrição</Label>
              <Textarea value={form.descricao} onChange={set("descricao")} rows={2} placeholder="Breve descrição do produto" />
            </div>
            <div className="grid gap-2">
              <Label>Preço (R$)</Label>
              <Input value={form.preco} onChange={set("preco")} placeholder="35,00" inputMode="decimal" />
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
