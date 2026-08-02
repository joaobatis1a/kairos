"use client"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PasswordInput } from "@/components/password-input"
import { PasswordRequisitos, REQUISITOS_SENHA } from "@/components/password-requisitos"
import { FotoPerfil } from "@/components/conta/foto-perfil"
import { atualizarPerfilCliente, trocarSenhaCliente } from "@/app/actions/perfil-cliente"
import { toast } from "sonner"
import { User, KeyRound, Loader2, Check } from "lucide-react"
import type { Cliente } from "@/lib/types"

/**
 * Perfil do cliente numa página só.
 *
 * Antes isso era duas abas ("Meus dados" e "Configurações") com uma divisão
 * arbitrária: trocar senha ficava em "dados" e tema/excluir conta em
 * "configurações". Somadas, davam cinco cartões pequenos. Agora é uma
 * página com seções em ordem de risco — identidade, dados, segurança,
 * preferência e por último o que é irreversível.
 *
 * O botão de sair saiu daqui: já existe no cabeçalho e no menu do
 * storefront, e uma ação global não precisa de três lugares.
 */
function Secao({
  icon: Icon,
  titulo,
  descricao,
  children,
  perigo = false,
}: {
  icon: React.ElementType
  titulo: string
  descricao?: string
  children: React.ReactNode
  perigo?: boolean
}) {
  return (
    <section
      className={`rounded-2xl border bg-card p-5 ${perigo ? "border-destructive/30" : "border-border"}`}
    >
      <div className="flex items-start gap-3">
        <span
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
            perigo ? "bg-destructive/15 text-destructive" : "bg-primary/15 text-primary"
          }`}
        >
          <Icon className="h-4 w-4" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <h2 className={`font-serif text-lg font-semibold ${perigo ? "text-destructive" : ""}`}>
            {titulo}
          </h2>
          {descricao && <p className="mt-0.5 text-sm text-muted-foreground">{descricao}</p>}
          <div className="mt-4">{children}</div>
        </div>
      </div>
    </section>
  )
}

export function ContaPerfilView({ cliente, fotoUrl }: { cliente: Cliente; fotoUrl: string | null }) {
  const [nome, setNome] = useState(cliente.nome)
  const [whatsapp, setWhatsapp] = useState(cliente.whatsapp)
  const [novaSenha, setNovaSenha] = useState("")
  const [pendingPerfil, startPerfil] = useTransition()
  const [pendingSenha, startSenha] = useTransition()

  const alterouDados = nome !== cliente.nome || whatsapp !== cliente.whatsapp

  function salvarPerfil(e: React.FormEvent) {
    e.preventDefault()
    startPerfil(async () => {
      const res = await atualizarPerfilCliente({ nome, whatsapp })
      if (!res.ok) toast.error(res.error ?? "Não foi possível salvar.")
      else toast.success("Dados atualizados.")
    })
  }

  function salvarSenha(e: React.FormEvent) {
    e.preventDefault()
    if (!REQUISITOS_SENHA.every((r) => r.test(novaSenha))) {
      toast.error("A senha não atende aos requisitos.")
      return
    }
    startSenha(async () => {
      const res = await trocarSenhaCliente(novaSenha)
      if (!res.ok) toast.error(res.error ?? "Não foi possível trocar a senha.")
      else {
        toast.success("Senha atualizada.")
        setNovaSenha("")
      }
    })
  }

  return (
    <div className="surgir flex flex-col gap-4">
      {/* Identidade: a foto é editável aqui mesmo, sem tela intermediária */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <FotoPerfil nome={cliente.nome} fotoUrl={fotoUrl} />
        <div className="mt-5 border-t border-border/60 pt-4">
          <p className="font-serif text-xl font-bold">{cliente.nome}</p>
          <p className="text-sm text-muted-foreground">{cliente.email}</p>
        </div>
      </div>

      <Secao icon={User} titulo="Dados pessoais" descricao="Usamos o WhatsApp para confirmar seus horários.">
        <form onSubmit={salvarPerfil} className="flex flex-col gap-4">
          {/* dois campos por linha no desktop: um input sozinho esticado por
              toda a largura fica desconfortável de ler e preencher */}
          <div className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="nome">Nome</Label>
            <Input
              id="nome"
              name="name"
              autoComplete="name"
              required
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="whatsapp">WhatsApp</Label>
            <Input
              id="whatsapp"
              name="tel"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              required
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
            />
          </div>
          </div>
          <div className="flex items-center gap-3">
            <Button type="submit" disabled={pendingPerfil || !alterouDados} className="rounded-full font-bold">
              {pendingPerfil ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
              Salvar alterações
            </Button>
            {!alterouDados && (
              <span className="text-sm text-muted-foreground">Nada alterado ainda.</span>
            )}
          </div>
        </form>
      </Secao>

      <Secao icon={KeyRound} titulo="Senha" descricao="Trocar a senha desconecta você dos outros aparelhos.">
        <form onSubmit={salvarSenha} className="flex flex-col gap-4">
          <div className="grid max-w-md gap-2">
            <Label htmlFor="novaSenha">Nova senha</Label>
            <PasswordInput
              id="novaSenha"
              name="new-password"
              autoComplete="new-password"
              value={novaSenha}
              onChange={(e) => setNovaSenha(e.target.value)}
              placeholder="Crie uma nova senha"
            />
            {novaSenha.length > 0 && <PasswordRequisitos senha={novaSenha} />}
          </div>
          <Button
            type="submit"
            disabled={pendingSenha || novaSenha.length === 0}
            className="self-start rounded-full font-bold"
          >
            {pendingSenha ? <Loader2 className="h-4 w-4 animate-spin" /> : <KeyRound className="h-4 w-4" />}
            Atualizar senha
          </Button>
        </form>
      </Secao>

    </div>
  )
}
