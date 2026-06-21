"use client"

import { useState, useTransition } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { PasswordInput } from "@/components/password-input"
import { PasswordRequisitos, REQUISITOS_SENHA } from "@/components/password-requisitos"
import { atualizarPerfilCliente, trocarSenhaCliente } from "@/app/actions/perfil-cliente"
import { toast } from "sonner"
import { Scissors, Loader2, ArrowLeft, User, KeyRound } from "lucide-react"
import type { Cliente } from "@/lib/types"
import { barbearia } from "@/config/barbearia"

export function ContaView({ cliente }: { cliente: Cliente }) {
  const [nome, setNome] = useState(cliente.nome)
  const [whatsapp, setWhatsapp] = useState(cliente.whatsapp)
  const [novaSenha, setNovaSenha] = useState("")
  const [pendingPerfil, startPerfil] = useTransition()
  const [pendingSenha, startSenha] = useTransition()

  function salvarPerfil(e: React.FormEvent) {
    e.preventDefault()
    startPerfil(async () => {
      const res = await atualizarPerfilCliente({ nome, whatsapp })
      if (!res.ok) toast.error(res.error ?? "Erro ao atualizar dados.")
      else toast.success("Dados atualizados com sucesso!")
    })
  }

  function salvarSenha(e: React.FormEvent) {
    e.preventDefault()
    const valida = REQUISITOS_SENHA.every((r) => r.test(novaSenha))
    if (!valida) {
      toast.error("A senha não atende aos requisitos mínimos.")
      return
    }
    startSenha(async () => {
      const res = await trocarSenhaCliente(novaSenha)
      if (!res.ok) toast.error(res.error ?? "Erro ao trocar senha.")
      else {
        toast.success("Senha atualizada!")
        setNovaSenha("")
      }
    })
  }

  return (
    <div className="flex min-h-svh w-full flex-col bg-background">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-2xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2 text-foreground">
            <Scissors className="h-6 w-6 text-primary" />
            <span className="font-serif text-xl font-semibold">{barbearia.nome}</span>
          </Link>
          <Link href="/" className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-2xl px-4 py-6 flex flex-col gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold">Minha conta</h1>
          <p className="text-muted-foreground">Veja e edite seus dados pessoais.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-serif">
              <User className="h-4 w-4 text-primary" /> Dados pessoais
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={salvarPerfil} className="flex flex-col gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">E-mail</Label>
                <Input id="email" value={cliente.email} disabled />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="nome">Nome</Label>
                <Input id="nome" required value={nome} onChange={(e) => setNome(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="whatsapp">WhatsApp</Label>
                <Input
                  id="whatsapp"
                  required
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                />
              </div>
              <Button type="submit" disabled={pendingPerfil} className="self-start">
                {pendingPerfil ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Salvando...
                  </>
                ) : (
                  "Salvar alterações"
                )}
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
                <Label htmlFor="novaSenha">Nova senha</Label>
                <PasswordInput
                  id="novaSenha"
                  value={novaSenha}
                  onChange={(e) => setNovaSenha(e.target.value)}
                  placeholder="Crie uma nova senha"
                />
                <PasswordRequisitos senha={novaSenha} />
              </div>
              <Button type="submit" disabled={pendingSenha} className="self-start">
                {pendingSenha ? <Loader2 className="h-4 w-4 animate-spin" /> : "Atualizar senha"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
