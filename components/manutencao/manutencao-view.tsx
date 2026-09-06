"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { stagger, item } from "@/lib/motion"
import {
  criarEmpresa,
  listarEmpresas,
  alternarStatusEmpresa,
  verCodigoConvite,
  rotacionarConviteOwner,
  excluirEmpresa,
  type EmpresaManutencao,
  type MetricasPlataforma,
} from "@/app/actions/manutencao"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { ContadorCodigo } from "@/components/contador-codigo"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { toast } from "sonner"
import { Building2, Plus, KeyRound, RefreshCw, Power, PowerOff, Trash2, Loader2, Copy } from "lucide-react"

export function ManutencaoView({
  empresasIniciais,
  metricas,
}: {
  empresasIniciais: EmpresaManutencao[]
  metricas: MetricasPlataforma
}) {
  const router = useRouter()
  const [empresas, setEmpresas] = useState(empresasIniciais)
  const [pending, startTransition] = useTransition()

  const [novoNome, setNovoNome] = useState("")
  const [codigoGerado, setCodigoGerado] = useState<{
    companyId: string
    nome: string
    slug: string
    code: string
    expiresAt: string
  } | null>(null)
  const [carregandoCodigoId, setCarregandoCodigoId] = useState<string | null>(null)
  const [alternandoId, setAlternandoId] = useState<string | null>(null)
  const [excluindo, setExcluindo] = useState<EmpresaManutencao | null>(null)
  const [confirmacaoExclusao, setConfirmacaoExclusao] = useState("")

  function handleCriar() {
    const nome = novoNome.trim()
    if (!nome) return
    startTransition(async () => {
      const res = await criarEmpresa(nome)
      if (!res.ok) {
        toast.error(res.error)
        return
      }
      setCodigoGerado({ companyId: res.id, nome, slug: res.slug, code: res.code, expiresAt: res.expiresAt })
      setNovoNome("")
      setEmpresas(await listarEmpresas())
      router.refresh()
    })
  }

  function handleAlternarStatus(empresa: EmpresaManutencao) {
    const novoStatus = empresa.status === "ativo" ? "inativo" : "ativo"
    setAlternandoId(empresa.id)
    startTransition(async () => {
      const res = await alternarStatusEmpresa(empresa.id, novoStatus)
      if (!res.ok) {
        toast.error(res.error)
      } else {
        setEmpresas((prev) => prev.map((e) => (e.id === empresa.id ? { ...e, status: novoStatus } : e)))
        toast.success(novoStatus === "inativo" ? `${empresa.nome} foi desativada.` : `${empresa.nome} foi reativada.`)
      }
      setAlternandoId(null)
    })
  }

  function handleVerCodigo(empresa: EmpresaManutencao) {
    setCarregandoCodigoId(empresa.id)
    startTransition(async () => {
      const res = await verCodigoConvite(empresa.id)
      if (!res) {
        toast.error("Nenhum código de convite encontrado para esta empresa.")
      } else {
        setCodigoGerado({ companyId: empresa.id, nome: empresa.nome, slug: empresa.slug, ...res })
      }
      setCarregandoCodigoId(null)
    })
  }

  // onExpirar do contador chama de novo — verCodigoConvite já gera um
  // código novo sozinho quando o vigente expirou, então isso simplesmente
  // atualiza o dialog aberto sem a pessoa precisar fazer nada.
  function refrescarCodigo(companyId: string) {
    startTransition(async () => {
      const res = await verCodigoConvite(companyId)
      if (res) setCodigoGerado((prev) => (prev ? { ...prev, ...res } : prev))
    })
  }

  function handleRotacionar(empresa: EmpresaManutencao) {
    setCarregandoCodigoId(empresa.id)
    startTransition(async () => {
      const res = await rotacionarConviteOwner(empresa.id)
      if (!res.ok) {
        toast.error(res.error)
      } else {
        setCodigoGerado({ companyId: empresa.id, nome: empresa.nome, slug: empresa.slug, code: res.code, expiresAt: res.expiresAt })
        toast.success("Código novo gerado. O anterior não vale mais.")
      }
      setCarregandoCodigoId(null)
    })
  }

  function handleExcluir() {
    if (!excluindo) return
    startTransition(async () => {
      const res = await excluirEmpresa(excluindo.id)
      if (!res.ok) {
        toast.error(res.error)
      } else {
        setEmpresas((prev) => prev.filter((e) => e.id !== excluindo.id))
        toast.success(`${excluindo.nome} foi excluída.`)
        setExcluindo(null)
        setConfirmacaoExclusao("")
      }
    })
  }

  function copiarCodigo() {
    if (!codigoGerado) return
    navigator.clipboard.writeText(codigoGerado.code)
    toast.success("Código copiado.")
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-serif text-3xl font-bold">Manutenção</h1>
        <p className="text-muted-foreground">Empresas cadastradas na plataforma.</p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {[
          { label: "Empresas ativas", valor: metricas.empresasAtivas },
          { label: "Empresas inativas", valor: metricas.empresasInativas },
          { label: "Pessoas na equipe", valor: metricas.totalEquipe },
          { label: "Clientes", valor: metricas.totalClientes },
          { label: "Agendamentos no mês", valor: metricas.agendamentosMes },
        ].map((m) => (
          <div key={m.label} className="rounded-xl border border-border bg-card p-3">
            <p className="text-2xl font-bold tabular-nums">{m.valor}</p>
            <p className="text-xs text-muted-foreground">{m.label}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-end">
        <div className="grid flex-1 gap-2">
          <Label htmlFor="novo-nome">Nova empresa</Label>
          <Input
            id="novo-nome"
            placeholder="Nome da barbearia"
            value={novoNome}
            onChange={(e) => setNovoNome(e.target.value)}
          />
        </div>
        <Button onClick={handleCriar} disabled={pending || !novoNome.trim()}>
          <Plus className="h-4 w-4" /> Criar empresa
        </Button>
      </div>

      {empresas.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border py-16 text-center">
          <Building2 className="h-10 w-10 text-muted-foreground" />
          <p className="text-muted-foreground">Nenhuma empresa cadastrada ainda.</p>
        </div>
      ) : (
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {empresas.map((empresa) => (
            <motion.div
              key={empresa.id}
              variants={item}
              className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/30"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-semibold">{empresa.nome}</p>
                    <p className="truncate text-xs text-muted-foreground">/b/{empresa.slug}</p>
                  </div>
                </div>
                <Badge variant={empresa.status === "ativo" ? "default" : "outline"}>
                  {empresa.status === "ativo" ? "Ativa" : "Inativa"}
                </Badge>
              </div>

              <div className="text-sm text-muted-foreground">
                <p>Dono: {empresa.ownerNome ?? "— (código ainda não resgatado)"}</p>
                <p>{empresa.totalEquipe} pessoa(s) na equipe</p>
              </div>

              <div className="flex items-center gap-1 border-t border-border pt-3">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleVerCodigo(empresa)}
                  disabled={pending && carregandoCodigoId === empresa.id}
                  title="Ver código de convite"
                  aria-label="Ver código de convite"
                >
                  {carregandoCodigoId === empresa.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <KeyRound className="h-4 w-4" />
                  )}
                </Button>
                {!empresa.ownerNome && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleRotacionar(empresa)}
                    disabled={pending && carregandoCodigoId === empresa.id}
                    title="Gerar código de convite novo"
                    aria-label="Gerar código de convite novo"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleAlternarStatus(empresa)}
                  disabled={pending && alternandoId === empresa.id}
                  title={empresa.status === "ativo" ? "Desativar empresa" : "Reativar empresa"}
                  aria-label={empresa.status === "ativo" ? "Desativar empresa" : "Reativar empresa"}
                >
                  {empresa.status === "ativo" ? (
                    <PowerOff className="h-4 w-4" />
                  ) : (
                    <Power className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="ml-auto text-muted-foreground hover:text-destructive"
                  onClick={() => setExcluindo(empresa)}
                  title="Excluir empresa"
                  aria-label="Excluir empresa"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      <Dialog open={!!codigoGerado} onOpenChange={(o) => !o && setCodigoGerado(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Código de convite gerado</DialogTitle>
            <DialogDescription>
              Envie esse código para o responsável de {codigoGerado?.nome}. Ele usa no cadastro da equipe para
              virar administrador da empresa.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/50 p-3">
            <span className="flex-1 text-center font-mono text-lg tracking-widest">{codigoGerado?.code}</span>
            <Button size="icon" variant="ghost" onClick={copiarCodigo} aria-label="Copiar código">
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          {codigoGerado && (
            <ContadorCodigo
              expiresAt={codigoGerado.expiresAt}
              onExpirar={() => refrescarCodigo(codigoGerado.companyId)}
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!excluindo}
        onOpenChange={(o) => {
          if (!o) {
            setExcluindo(null)
            setConfirmacaoExclusao("")
          }
        }}
      >
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Excluir empresa</DialogTitle>
            <DialogDescription>
              Ação permanente: apaga a empresa, todos os dados e o login de toda a equipe dela.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-2">
            <Label htmlFor="confirmar-exclusao">
              Digite <span className="font-semibold">{excluindo?.nome}</span> para confirmar
            </Label>
            <Input
              id="confirmar-exclusao"
              value={confirmacaoExclusao}
              onChange={(e) => setConfirmacaoExclusao(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setExcluindo(null)
                setConfirmacaoExclusao("")
              }}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleExcluir}
              disabled={pending || confirmacaoExclusao.trim() !== excluindo?.nome.trim()}
            >
              Excluir empresa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
