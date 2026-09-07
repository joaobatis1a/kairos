"use client"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PasswordInput } from "@/components/password-input"
import { GoogleButton } from "@/components/google-button"
import { Separator } from "@/components/ui/separator"
import { useSearchParams } from "next/navigation"
import { Suspense, useState } from "react"
import Link from "next/link"
import { Loader2, ArrowLeft } from "lucide-react"
import { ScissorMark } from "@/components/scissor-mark"
import { DEMO_MODE, DEMO_OWNER, DEMO_BARBEIRO, DEMO_CLIENTE } from "@/lib/demo"

// O login de equipe autentica qualquer conta válida e deixa o redirecionamento
// pro lugar certo por conta do getPerfilOuRedirect (que manda cliente pra
// /conta sozinho) — então dá pra listar as três contas de demo aqui, como
// o práxis faz, sem precisar mandar quem quer testar como cliente pra uma
// segunda tela de login.
const DEMO_CONTAS = [DEMO_OWNER, DEMO_BARBEIRO, DEMO_CLIENTE]

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  )
}

function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const searchParams = useSearchParams()
  const next = searchParams.get("next") ?? "/painel"
  const erro = searchParams.get("erro")
  const mensagemErro =
    erro === "inativo"
      ? "Sua conta foi desativada pelo administrador da barbearia."
      : erro === "empresa-inativa"
        ? "O acesso desta barbearia foi desativado."
        : null

  async function entrar(emailInput: string, senhaInput: string) {
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signInWithPassword({ email: emailInput, password: senhaInput })
      if (error) throw error
      // Garante que a sessão terminou de ser persistida (cookie escrito) antes
      // da navegação cheia: window.location.href dispara uma requisição nova
      // pro servidor, e é o middleware que decide pra onde mandar cada tipo
      // de conta a partir desse cookie. Sem esperar aqui, em conexões mais
      // lentas (comum no Safari/PWA) a navegação às vezes saía antes do
      // cookie existir — o middleware não via ninguém logado e mandava de
      // volta pro login, dando a impressão de que "não fez nada" na primeira
      // tentativa.
      await supabase.auth.getSession()
      window.location.href = next
    } catch (err: unknown) {
      setError(err instanceof Error ? "E-mail ou senha incorretos." : "Ocorreu um erro.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    entrar(email, password)
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
            <CardTitle className="font-serif text-2xl">Área da equipe</CardTitle>
            <CardDescription>Entre com seu e-mail e senha para acessar o painel.</CardDescription>
          </CardHeader>
          <CardContent>
            {mensagemErro && (
              <p className="mb-4 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {mensagemErro}
              </p>
            )}
            {!DEMO_MODE && (
              <>
                <div className="flex flex-col gap-3">
                  <GoogleButton redirectPath={next} />
                </div>
                <div className="my-5 flex items-center gap-2">
                  <Separator className="flex-1" />
                  <span className="text-xs text-muted-foreground">ou</span>
                  <Separator className="flex-1" />
                </div>
              </>
            )}
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
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Senha</Label>
                    {!DEMO_MODE && (
                      <Link
                        href="/auth/esqueci-senha"
                        className="text-xs text-primary underline-offset-4 hover:underline"
                      >
                        Esqueci minha senha
                      </Link>
                    )}
                  </div>
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
            {DEMO_MODE ? (
              <div className="mt-5 rounded-lg border border-primary/30 bg-primary/[0.06] p-3 text-sm">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Contas de demonstração
                </p>
                <ul className="mt-2 space-y-1">
                  {DEMO_CONTAS.map((conta) => (
                    <li key={conta.email}>
                      <button
                        type="button"
                        onClick={() => {
                          setEmail(conta.email)
                          setPassword(conta.senha)
                        }}
                        className="text-foreground hover:text-primary"
                      >
                        <span className="font-medium">{conta.label}:</span> {conta.email}
                      </button>
                    </li>
                  ))}
                </ul>
                <p className="mt-2 text-xs text-muted-foreground">Senha para todas: {DEMO_OWNER.senha}</p>
              </div>
            ) : (
              <p className="mt-5 text-center text-xs text-muted-foreground">
                Tem um código de convite?{" "}
                <Link href="/auth/cadastro-equipe" className="text-primary underline-offset-4 hover:underline">
                  Cadastre-se
                </Link>
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
