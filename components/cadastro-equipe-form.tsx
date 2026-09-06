"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { cadastrarComCodigo, validarCodigoConvite } from "@/app/actions/equipe"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { PasswordInput } from "@/components/password-input"
import { PasswordRequisitos, senhaValida } from "@/components/password-requisitos"
import { GoogleButton } from "@/components/google-button"
import { Loader2, KeyRound, ArrowLeft } from "lucide-react"
import { ScissorMark } from "@/components/scissor-mark"
import { toast } from "sonner"

export function CadastroEquipeForm({ emailAtual }: { emailAtual: string | null }) {
  const [step, setStep] = useState<"codigo" | "dados">("codigo")
  const [nome, setNome] = useState("")
  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")
  const [confirmarSenha, setConfirmarSenha] = useState("")
  const [codigo, setCodigo] = useState("")
  const [pending, startTransition] = useTransition()
  const router = useRouter()

  const senhasConferem = senha.length > 0 && senha === confirmarSenha

  // Só valida se o código existe/não expirou — não consome. O resgate de
  // verdade acontece no submit final, depois de nome/e-mail/senha, pra
  // não ter uma segunda janela de corrida entre os dois passos.
  function handleProximo(e: React.FormEvent) {
    e.preventDefault()
    startTransition(async () => {
      const res = await validarCodigoConvite(codigo)
      if (!res.ok) {
        toast.error(res.error)
        return
      }
      setStep("dados")
    })
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    startTransition(async () => {
      const res = await cadastrarComCodigo(
        emailAtual ? { codigo } : { nome, email, senha, codigo },
      )
      if (!res.ok) {
        toast.error(res.error ?? "Não foi possível concluir o cadastro.")
        return
      }
      toast.success("Conta vinculada com sucesso!")
      router.push("/painel")
      router.refresh()
    })
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center bg-background p-6">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex items-center justify-center gap-2">
          <ScissorMark className="h-6 w-6 text-primary" />
          <span className="font-serif text-xl font-semibold">kairos</span>
        </div>
        <Card>
          <CardHeader className="items-center text-center">
            <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/15 text-primary">
              <KeyRound className="h-6 w-6" />
            </div>
            <CardTitle className="font-serif text-2xl">
              {emailAtual ? "Só falta o código" : step === "codigo" ? "Cadastro da equipe" : "Seus dados"}
            </CardTitle>
            <CardDescription>
              {emailAtual
                ? `Entrando como ${emailAtual}. Informe o código de convite recebido.`
                : step === "codigo"
                  ? "Peça o código de convite pra quem administra o kairos ou pro dono da sua barbearia."
                  : `Código ${codigo} confirmado. Agora crie seu acesso.`}
            </CardDescription>
            {emailAtual && (
              <button
                type="button"
                onClick={() => {
                  const supabase = createClient()
                  supabase.auth.signOut().then(() => window.location.reload())
                }}
                className="text-xs text-muted-foreground underline underline-offset-4 hover:text-foreground"
              >
                Não é você? Sair e usar outra conta
              </button>
            )}
          </CardHeader>
          <CardContent className="flex flex-col gap-5">
            {!emailAtual && step === "codigo" && (
              <>
                <GoogleButton redirectPath="/auth/cadastro-equipe" label="Continuar com Google" />
                <div className="flex items-center gap-2">
                  <Separator className="flex-1" />
                  <span className="text-xs text-muted-foreground">ou com e-mail</span>
                  <Separator className="flex-1" />
                </div>
              </>
            )}

            {emailAtual ? (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="codigo">Código de convite</Label>
                  <Input
                    id="codigo"
                    required
                    autoFocus
                    value={codigo}
                    onChange={(e) => setCodigo(e.target.value.toUpperCase())}
                    placeholder="Ex: AB12CD34"
                    className="tracking-widest"
                  />
                </div>
                <Button type="submit" className="w-full" disabled={pending}>
                  {pending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Entrando...
                    </>
                  ) : (
                    "Entrar"
                  )}
                </Button>
              </form>
            ) : step === "codigo" ? (
              <form onSubmit={handleProximo} className="flex flex-col gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="codigo">Código de convite</Label>
                  <Input
                    id="codigo"
                    required
                    autoFocus
                    value={codigo}
                    onChange={(e) => setCodigo(e.target.value.toUpperCase())}
                    placeholder="Ex: AB12CD34"
                    className="tracking-widest"
                  />
                </div>
                <Button type="submit" className="w-full" disabled={pending || !codigo.trim()}>
                  {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Próximo"}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="nome">Seu nome</Label>
                  <Input id="nome" required autoFocus value={nome} onChange={(e) => setNome(e.target.value)} />
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
                  <Label htmlFor="senha">Senha</Label>
                  <PasswordInput id="senha" required value={senha} onChange={(e) => setSenha(e.target.value)} />
                  <PasswordRequisitos senha={senha} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="confirmarSenha">Confirmar senha</Label>
                  <PasswordInput
                    id="confirmarSenha"
                    required
                    value={confirmarSenha}
                    onChange={(e) => setConfirmarSenha(e.target.value)}
                  />
                  {confirmarSenha.length > 0 && !senhasConferem && (
                    <p className="text-xs text-destructive">As senhas não são iguais.</p>
                  )}
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={pending || !senhaValida(senha) || !senhasConferem}
                >
                  {pending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Criando...
                    </>
                  ) : (
                    "Criar conta"
                  )}
                </Button>
                <button
                  type="button"
                  onClick={() => setStep("codigo")}
                  className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
                >
                  <ArrowLeft className="h-3.5 w-3.5" /> Trocar código
                </button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
