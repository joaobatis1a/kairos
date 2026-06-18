"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { criarOwner } from "@/app/actions/equipe"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { GoogleButton } from "@/components/google-button"
import { Scissors, Loader2, ShieldCheck } from "lucide-react"
import { barbearia } from "@/config/barbearia"
import { toast } from "sonner"

export function SetupForm() {
  const [nome, setNome] = useState("")
  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")
  const [pending, startTransition] = useTransition()
  const router = useRouter()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    startTransition(async () => {
      const res = await criarOwner({ nome, email, senha })
      if (!res.ok) {
        toast.error(res.error ?? "Erro ao criar administrador.")
        return
      }
      // login automático
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithPassword({ email, password: senha })
      if (error) {
        toast.success("Administrador criado! Faça login.")
        router.push("/auth/login")
        return
      }
      toast.success("Bem-vindo! Administrador criado com sucesso.")
      router.push("/painel")
      router.refresh()
    })
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center bg-background p-6">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex items-center justify-center gap-2">
          <Scissors className="h-6 w-6 text-primary" />
          <span className="font-serif text-xl font-semibold">{barbearia.nome}</span>
        </div>
        <Card>
          <CardHeader className="items-center text-center">
            <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/15 text-primary">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <CardTitle className="font-serif text-2xl">Configuração inicial</CardTitle>
            <CardDescription>
              Crie a conta do administrador (dono). Esta etapa só aparece uma vez.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-5">
            {/* Opção Google */}
            <GoogleButton
              redirectPath="/painel"
              setupOwner={true}
              label="Configurar com Google"
            />

            <div className="flex items-center gap-2">
              <Separator className="flex-1" />
              <span className="text-xs text-muted-foreground">ou com e-mail</span>
              <Separator className="flex-1" />
            </div>

            {/* Opção e-mail + senha */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="grid gap-2">
                <Label htmlFor="nome">Seu nome</Label>
                <Input
                  id="nome"
                  required
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Nome do dono"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="voce@exemplo.com"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="senha">Senha</Label>
                <Input
                  id="senha"
                  type="password"
                  required
                  minLength={6}
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                />
              </div>
              <Button type="submit" className="w-full" disabled={pending}>
                {pending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Criando...
                  </>
                ) : (
                  "Criar administrador"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
