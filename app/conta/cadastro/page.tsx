"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PasswordInput } from "@/components/password-input"
import { PasswordRequisitos, senhaValida } from "@/components/password-requisitos"
import { GoogleButton } from "@/components/google-button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { cadastrarCliente } from "@/app/actions/conta"
import { toast } from "sonner"
import { Scissors, Loader2, ArrowLeft } from "lucide-react"
import { barbearia } from "@/config/barbearia"
import { cn } from "@/lib/utils"

export default function CadastroPage() {
  const router = useRouter()
  const [etapa, setEtapa] = useState<1 | 2>(1)
  const [nome, setNome] = useState("")
  const [email, setEmail] = useState("")
  const [whatsapp, setWhatsapp] = useState("")
  const [senha, setSenha] = useState("")
  const [confirmarSenha, setConfirmarSenha] = useState("")
  const [erro, setErro] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [sucesso, setSucesso] = useState(false)

  function handleContinuar(e: React.FormEvent) {
    e.preventDefault()
    setErro(null)

    if (!nome.trim() || !email.trim() || !whatsapp.trim()) {
      setErro("Preencha todos os campos.")
      return
    }

    setEtapa(2)
  }

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
    const res = await cadastrarCliente({ nome, email, whatsapp, senha })
    setLoading(false)

    if (!res.ok) {
      setErro(res.error ?? "Não foi possível criar sua conta.")
      return
    }

    setSucesso(true)
    toast.success("Conta criada com sucesso!")
    setTimeout(() => {
      router.push("/conta/login")
    }, 1500)
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
            <CardTitle className="font-serif text-2xl">Criar conta</CardTitle>
            <CardDescription>
              {sucesso
                ? "Conta criada!"
                : etapa === 1
                  ? "Vamos começar com seus dados básicos."
                  : "Agora, crie uma senha segura."}
            </CardDescription>
            {!sucesso && (
              <div className="mt-2 flex gap-1.5">
                <div className={cn("h-1 flex-1 rounded-full", "bg-primary")} />
                <div className={cn("h-1 flex-1 rounded-full", etapa === 2 ? "bg-primary" : "bg-muted")} />
              </div>
            )}
          </CardHeader>
          <CardContent>
            {sucesso ? (
              <p className="text-center text-sm text-muted-foreground">
                Redirecionando para o login...
              </p>
            ) : etapa === 1 ? (
              <>
                <div className="flex flex-col gap-3">
                  <GoogleButton redirectPath="/conta" />
                </div>
                <div className="my-5 flex items-center gap-2">
                  <Separator className="flex-1" />
                  <span className="text-xs text-muted-foreground">ou</span>
                  <Separator className="flex-1" />
                </div>
                <form onSubmit={handleContinuar}>
                  <div className="flex flex-col gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="nome">Nome</Label>
                      <Input id="nome" required value={nome} onChange={(e) => setNome(e.target.value)} />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="email">E-mail</Label>
                      <Input
                        id="email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="whatsapp">WhatsApp</Label>
                      <Input
                        id="whatsapp"
                        required
                        placeholder="(11) 91234-5678"
                        value={whatsapp}
                        onChange={(e) => setWhatsapp(e.target.value)}
                      />
                    </div>
                    {erro && <p className="text-sm text-destructive">{erro}</p>}
                    <Button type="submit" className="w-full">
                      Continuar
                    </Button>
                  </div>
                </form>
                <p className="mt-5 text-center text-sm text-muted-foreground">
                  Já tem conta?{" "}
                  <Link href="/conta/login" className="text-primary underline-offset-4 hover:underline">
                    Entrar
                  </Link>
                </p>
              </>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="flex flex-col gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="senha">Senha</Label>
                    <PasswordInput
                      id="senha"
                      required
                      placeholder="Crie uma senha"
                      value={senha}
                      onChange={(e) => setSenha(e.target.value)}
                      autoFocus
                    />
                    <PasswordRequisitos senha={senha} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="confirmarSenha">Confirmar senha</Label>
                    <PasswordInput
                      id="confirmarSenha"
                      required
                      placeholder="Repita a senha"
                      value={confirmarSenha}
                      onChange={(e) => setConfirmarSenha(e.target.value)}
                    />
                  </div>
                  {erro && <p className="text-sm text-destructive">{erro}</p>}
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1"
                      onClick={() => {
                        setErro(null)
                        setEtapa(1)
                      }}
                      disabled={loading}
                    >
                      Voltar
                    </Button>
                    <Button type="submit" className="flex-1" disabled={loading}>
                      {loading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" /> Criando...
                        </>
                      ) : (
                        "Criar conta"
                      )}
                    </Button>
                  </div>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
