"use client"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PasswordInput } from "@/components/password-input"
import { GoogleButton } from "@/components/google-button"
import { Separator } from "@/components/ui/separator"
import { useRouter } from "next/navigation"
import { useState } from "react"
import Link from "next/link"
import { Scissors, Loader2, ArrowLeft } from "lucide-react"
import { barbearia } from "@/config/barbearia"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      router.refresh()
      window.location.href = "/painel"
    } catch (err: unknown) {
      setError(err instanceof Error ? "E-mail ou senha incorretos." : "Ocorreu um erro.")
    } finally {
      setIsLoading(false)
    }
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
            <CardTitle className="font-serif text-2xl">Área da equipe</CardTitle>
            <CardDescription>Entre com seu e-mail e senha para acessar o painel.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3">
              <GoogleButton redirectPath="/painel" />
            </div>
            <div className="my-5 flex items-center gap-2">
              <Separator className="flex-1" />
              <span className="text-xs text-muted-foreground">ou</span>
              <Separator className="flex-1" />
            </div>
            <form onSubmit={handleLogin}>
              <div className="flex flex-col gap-5">
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
                  <Label htmlFor="password">Senha</Label>
                  <PasswordInput
                    id="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                {error && <p className="text-sm text-destructive">{error}</p>}
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Entrando...
                    </>
                  ) : (
                    "Entrar"
                  )}
                </Button>
              </div>
            </form>
            <p className="mt-5 text-center text-xs text-muted-foreground">
              Primeira vez?{" "}
              <Link href="/auth/setup" className="text-primary underline-offset-4 hover:underline">
                Configurar administrador
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
