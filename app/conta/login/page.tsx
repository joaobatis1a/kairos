"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PasswordInput } from "@/components/password-input"
import { GoogleButton } from "@/components/google-button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Scissors, Loader2, ArrowLeft } from "lucide-react"
import { barbearia } from "@/config/barbearia"

export default function ContaLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")
  const [erro, setErro] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErro(null)
    setLoading(true)

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password: senha })

    if (error) {
      setErro("E-mail ou senha incorretos.")
      setLoading(false)
      return
    }

    router.refresh()
    window.location.href = "/"
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center bg-background p-6">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-foreground">
            <Scissors className="h-6 w-6 text-primary" />
            <span className="font-serif text-xl font-semibold">{barbearia.nome}</span>
          </Link>
          <Link href="/" className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="font-serif text-2xl">Entrar</CardTitle>
            <CardDescription>Acesse sua conta para agendar e ver seu histórico.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3">
              <GoogleButton redirectPath="/" />
            </div>
            <div className="my-5 flex items-center gap-2">
              <Separator className="flex-1" />
              <span className="text-xs text-muted-foreground">ou</span>
              <Separator className="flex-1" />
            </div>
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="voce@exemplo.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="senha">Senha</Label>
                    <Link
                      href="/conta/esqueci-senha"
                      className="text-xs text-primary underline-offset-4 hover:underline"
                    >
                      Esqueci minha senha
                    </Link>
                  </div>
                  <PasswordInput
                    id="senha"
                    required
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                  />
                </div>
                {erro && <p className="text-sm text-destructive">{erro}</p>}
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Entrando...
                    </>
                  ) : (
                    "Entrar"
                  )}
                </Button>
              </div>
            </form>
            <p className="mt-5 text-center text-sm text-muted-foreground">
              Ainda não tem conta?{" "}
              <Link href="/conta/cadastro" className="text-primary underline-offset-4 hover:underline">
                Criar conta
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
