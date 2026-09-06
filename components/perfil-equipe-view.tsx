"use client"

import { useState, useTransition } from "react"
import { useTheme } from "next-themes"
import { useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { PasswordInput } from "@/components/password-input"
import { PasswordRequisitos, REQUISITOS_SENHA } from "@/components/password-requisitos"
import { DeletarConta } from "@/components/deletar-conta"
import { atualizarPerfilEquipe, trocarSenhaEquipe } from "@/app/actions/perfil-equipe"
import { toast } from "sonner"
import { User, Loader2, Sun, Moon, KeyRound } from "lucide-react"
import type { Profile } from "@/lib/types"

export function PerfilEquipeView({ perfil }: { perfil: Profile }) {
  const [nome, setNome] = useState(perfil.nome)
  const [whatsapp, setWhatsapp] = useState(perfil.whatsapp)
  const [senhaAtual, setSenhaAtual] = useState("")
  const [novaSenha, setNovaSenha] = useState("")
  const [confirmarSenha, setConfirmarSenha] = useState("")
  const [pendingPerfil, startPerfil] = useTransition()
  const [pendingSenha, startSenha] = useTransition()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  const senhasConferem = novaSenha.length > 0 && novaSenha === confirmarSenha

  function salvarPerfil(e: React.FormEvent) {
    e.preventDefault()
    startPerfil(async () => {
      const res = await atualizarPerfilEquipe({ nome, whatsapp })
      if (!res.ok) toast.error(res.error ?? "Erro ao salvar.")
      else toast.success("Dados atualizados!")
    })
  }

  function salvarSenha(e: React.FormEvent) {
    e.preventDefault()
    if (!REQUISITOS_SENHA.every((r) => r.test(novaSenha))) {
      toast.error("A senha não atende aos requisitos mínimos.")
      return
    }
    if (!senhasConferem) {
      toast.error("As senhas não são iguais.")
      return
    }
    startSenha(async () => {
      const res = await trocarSenhaEquipe(senhaAtual, novaSenha)
      if (!res.ok) toast.error(res.error ?? "Erro ao trocar senha.")
      else {
        toast.success("Senha atualizada!")
        setSenhaAtual("")
        setNovaSenha("")
        setConfirmarSenha("")
      }
    })
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-serif text-3xl font-bold">Perfil</h1>
        <p className="text-muted-foreground">Gerencie suas informações pessoais.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-serif">
            <User className="h-4 w-4 text-primary" /> Dados pessoais
          </CardTitle>
          <CardDescription className="capitalize">
            {perfil.role === "owner" ? "Administrador" : "Barbeiro"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={salvarPerfil} className="flex flex-col gap-4">
            <div className="grid gap-2">
              <Label htmlFor="nome">Nome</Label>
              <Input id="nome" value={nome} onChange={(e) => setNome(e.target.value)} required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="whatsapp">WhatsApp</Label>
              <Input
                id="whatsapp"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="(11) 99999-9999"
              />
            </div>
            <Button type="submit" disabled={pendingPerfil} className="self-start">
              {pendingPerfil ? <Loader2 className="h-4 w-4 animate-spin" /> : "Salvar alterações"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-serif">
            <KeyRound className="h-4 w-4 text-primary" /> Trocar senha
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={salvarSenha} className="flex flex-col gap-4">
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="senhaAtual">Senha atual</Label>
                <Link
                  href="/auth/esqueci-senha"
                  className="text-xs text-primary underline-offset-4 hover:underline"
                >
                  Esqueceu sua senha atual?
                </Link>
              </div>
              <PasswordInput
                id="senhaAtual"
                required
                value={senhaAtual}
                onChange={(e) => setSenhaAtual(e.target.value)}
                placeholder="Confirme quem é você"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="novaSenha">Nova senha</Label>
              <PasswordInput
                id="novaSenha"
                value={novaSenha}
                onChange={(e) => setNovaSenha(e.target.value)}
                placeholder="Crie uma nova senha"
              />
              <PasswordRequisitos senha={novaSenha} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirmarSenha">Confirmar nova senha</Label>
              <PasswordInput
                id="confirmarSenha"
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
              />
              {confirmarSenha.length > 0 && !senhasConferem && (
                <p className="text-xs text-destructive">As senhas não são iguais.</p>
              )}
            </div>
            <Button
              type="submit"
              disabled={pendingSenha || !senhaAtual || !senhasConferem}
              className="self-start"
            >
              {pendingSenha ? <Loader2 className="h-4 w-4 animate-spin" /> : "Atualizar senha"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-serif">Aparência</CardTitle>
          <CardDescription>Escolha como o painel aparece para você.</CardDescription>
        </CardHeader>
        <CardContent>
          {mounted && (
            <div className="grid grid-cols-2 gap-3 sm:max-w-xs">
              <button
                type="button"
                onClick={() => setTheme("light")}
                className={`flex flex-col items-center gap-2 rounded-xl border p-4 transition-colors ${
                  theme === "light" ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"
                }`}
              >
                <Sun className={`h-6 w-6 ${theme === "light" ? "text-primary" : "text-muted-foreground"}`} />
                <span className="text-sm font-medium">Claro</span>
              </button>
              <button
                type="button"
                onClick={() => setTheme("dark")}
                className={`flex flex-col items-center gap-2 rounded-xl border p-4 transition-colors ${
                  theme === "dark" ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"
                }`}
              >
                <Moon className={`h-6 w-6 ${theme === "dark" ? "text-primary" : "text-muted-foreground"}`} />
                <span className="text-sm font-medium">Escuro</span>
              </button>
            </div>
          )}
        </CardContent>
      </Card>

      {perfil.role !== "owner" && (
        <Card className="border-destructive/30">
          <CardHeader>
            <CardTitle className="font-serif text-destructive">Zona de perigo</CardTitle>
            <CardDescription>Esta ação é permanente e não pode ser desfeita.</CardDescription>
          </CardHeader>
          <CardContent>
            <DeletarConta />
          </CardContent>
        </Card>
      )}
    </div>
  )
}
