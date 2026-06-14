"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { solicitarRedefinicaoSenha } from "@/app/actions/conta"
import { Scissors, Loader2 } from "lucide-react"
import { barbearia } from "@/config/barbearia"

export default function EsqueciSenhaPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState<string | null>(null)
  const [enviado, setEnviado] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErro(null)
    setLoading(true)

    const res = await solicitarRedefinicaoSenha(email)
    setLoading(false)

    if (!res.ok) {
      setErro(res.error ?? "Não foi possível enviar o e-mail.")
      return
    }

    setEnviado(true)
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
            <CardTitle className="font-serif text-2xl">Esqueci minha senha</CardTitle>
            <CardDescription>
              Informe seu e-mail e enviaremos um link para redefinir sua senha.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {enviado ? (
              <p className="text-sm text-muted-foreground">
                Se houver uma conta com esse e-mail, você receberá um link para redefinir sua senha em
                poucos minutos.
              </p>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="flex flex-col gap-4">
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
                  {erro && <p className="text-sm text-destructive">{erro}</p>}
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" /> Enviando...
                      </>
                    ) : (
                      "Enviar link"
                    )}
                  </Button>
                </div>
              </form>
            )}
            <p className="mt-5 text-center text-sm text-muted-foreground">
              <Link href="/conta/login" className="text-primary underline-offset-4 hover:underline">
                Voltar para o login
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
