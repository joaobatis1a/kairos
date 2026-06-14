"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { PasswordInput } from "@/components/password-input"
import { PasswordRequisitos, senhaValida } from "@/components/password-requisitos"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { redefinirSenha } from "@/app/actions/conta"
import { Scissors, Loader2 } from "lucide-react"
import { barbearia } from "@/config/barbearia"

export default function RedefinirSenhaPage() {
  const router = useRouter()
  const [senha, setSenha] = useState("")
  const [confirmarSenha, setConfirmarSenha] = useState("")
  const [erro, setErro] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [sucesso, setSucesso] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErro(null)

    if (!senhaValida(senha)) {
      setErro("A senha não atende aos requisitos mínimos.")
      return
    }

    if (senha !== confirmarSenha) {
      setErro("As senhas não coincidem.")
      return
    }

    setLoading(true)
    const res = await redefinirSenha(senha)
    setLoading(false)

    if (!res.ok) {
      setErro(res.error ?? "Não foi possível redefinir sua senha.")
      return
    }

    setSucesso(true)
    setTimeout(() => {
      router.push("/conta/login")
    }, 1500)
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center bg-background p-6">
      <div className="w-full max-w-sm">
        <Link href="/" className="mb-6 flex items-center justify-center gap-2 text-foreground">
          <Scissors className="h-6 w-6 text-primary" />
          <span className="font-serif text-xl font-semibold">{barbearia.nome}</span>
        </Link>
        <Card>
          <CardHeader>
            <CardTitle className="font-serif text-2xl">Redefinir senha</CardTitle>
            <CardDescription>Escolha uma nova senha para sua conta.</CardDescription>
          </CardHeader>
          <CardContent>
            {sucesso ? (
              <p className="text-center text-sm text-muted-foreground">
                Senha redefinida! Redirecionando para o login...
              </p>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="flex flex-col gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="senha">Nova senha</Label>
                    <PasswordInput
                      id="senha"
                      required
                      placeholder="Crie uma nova senha"
                      value={senha}
                      onChange={(e) => setSenha(e.target.value)}
                    />
                    <PasswordRequisitos senha={senha} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="confirmarSenha">Confirmar nova senha</Label>
                    <PasswordInput
                      id="confirmarSenha"
                      required
                      placeholder="Repita a senha"
                      value={confirmarSenha}
                      onChange={(e) => setConfirmarSenha(e.target.value)}
                    />
                  </div>
                  {erro && <p className="text-sm text-destructive">{erro}</p>}
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" /> Salvando...
                      </>
                    ) : (
                      "Redefinir senha"
                    )}
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
