"use client"

import { Suspense, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PasswordInput } from "@/components/password-input"
import { GoogleButton } from "@/components/google-button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Loader2, ArrowLeft } from "lucide-react"
import { ScissorMark } from "@/components/scissor-mark"
import { DEMO_MODE, DEMO_CLIENTE } from "@/lib/demo"

export default function ContaLoginPage() {
  return (
    <Suspense fallback={null}>
      <ContaLoginForm />
    </Suspense>
  )
}

function ContaLoginForm() {
  const searchParams = useSearchParams()
  const next = searchParams.get("next") ?? "/"
  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")
  const [erro, setErro] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function entrar(emailInput: string, senhaInput: string) {
    setErro(null)
    setLoading(true)

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email: emailInput, password: senhaInput })

    if (error) {
      setErro("E-mail ou senha incorretos.")
      setLoading(false)
      return
    }

    window.location.href = next
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    entrar(email, senha)
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center bg-background p-6">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-foreground">
            <ScissorMark className="h-6 w-6 text-primary" />
            <span className="font-serif text-xl font-semibold">kairos</span>
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
            {DEMO_MODE && (
              <div className="mb-5 rounded-lg border border-primary/30 bg-primary/[0.06] p-3 text-sm">
                <p className="font-medium text-foreground">Isso é uma demonstração pública.</p>
                <p className="mt-0.5 text-muted-foreground">
                  Nada que você criar ou editar é salvo de verdade.
                </p>
                <Button
                  type="button"
                  size="sm"
                  className="mt-3 w-full"
                  disabled={loading}
                  onClick={() => entrar(DEMO_CLIENTE.email, DEMO_CLIENTE.senha)}
                >
                  Entrar como cliente
                </Button>
              </div>
            )}
            <div className="flex flex-col gap-3">
              <GoogleButton redirectPath={next} />
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
