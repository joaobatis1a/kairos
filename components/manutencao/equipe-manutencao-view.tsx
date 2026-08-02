"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { stagger, item } from "@/lib/motion"
import {
  adicionarContaManutencao,
  listarContasManutencao,
  removerContaManutencao,
  type ContaManutencao,
} from "@/app/actions/manutencao"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog"
import { toast } from "sonner"
import { ShieldCheck, UserPlus, Trash2, Loader2 } from "lucide-react"

export function EquipeManutencaoView({ contasIniciais }: { contasIniciais: ContaManutencao[] }) {
  const router = useRouter()
  const [contas, setContas] = useState(contasIniciais)
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState("")
  const [pending, startTransition] = useTransition()
  const [removendo, setRemovendo] = useState<ContaManutencao | null>(null)

  function handleAdicionar() {
    const emailTratado = email.trim()
    if (!emailTratado) return
    startTransition(async () => {
      const res = await adicionarContaManutencao(emailTratado)
      if (!res.ok) {
        toast.error(res.error)
        return
      }
      toast.success("Conta de manutenção adicionada.")
      setEmail("")
      setOpen(false)
      setContas(await listarContasManutencao())
      router.refresh()
    })
  }

  function handleRemover() {
    if (!removendo) return
    startTransition(async () => {
      const res = await removerContaManutencao(removendo.id)
      if (!res.ok) {
        toast.error(res.error)
        setRemovendo(null)
        return
      }
      setContas((prev) => prev.filter((c) => c.id !== removendo.id))
      toast.success("Conta removida.")
      setRemovendo(null)
    })
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-serif text-3xl font-bold">Equipe de manutenção</h1>
          <p className="text-muted-foreground">Quem mais tem acesso de superadmin à plataforma.</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger
            render={
              <Button>
                <UserPlus className="h-4 w-4" /> Adicionar conta
              </Button>
            }
          />
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="font-serif text-xl">Nova conta de manutenção</DialogTitle>
              <DialogDescription>
                A pessoa precisa entrar com esse e-mail (Google ou e-mail/senha já cadastrado) pra
                virar superadmin.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-2">
              <Label htmlFor="email-manutencao">E-mail</Label>
              <Input
                id="email-manutencao"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="pessoa@exemplo.com"
              />
            </div>
            <DialogFooter>
              <Button onClick={handleAdicionar} disabled={pending || !email.trim()} className="w-full">
                {pending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Adicionando...
                  </>
                ) : (
                  "Adicionar"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <motion.div variants={stagger} initial="hidden" animate="show" className="flex flex-col gap-2">
        {contas.map((c) => (
          <motion.div
            key={c.id}
            variants={item}
            className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/30"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/15 text-primary">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium">{c.email}</p>
                <p className="text-xs text-muted-foreground">
                  desde {new Date(c.createdAt).toLocaleDateString("pt-BR")}
                </p>
              </div>
            </div>
            <Button
              size="sm"
              variant="ghost"
              className="text-muted-foreground hover:text-destructive"
              onClick={() => setRemovendo(c)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </motion.div>
        ))}
      </motion.div>

      <Dialog open={!!removendo} onOpenChange={(o) => !o && setRemovendo(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Remover conta de manutenção?</DialogTitle>
            <DialogDescription>
              {removendo?.email} perde o acesso de superadmin imediatamente.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRemovendo(null)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleRemover} disabled={pending}>
              Remover
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
