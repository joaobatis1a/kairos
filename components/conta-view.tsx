"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { atualizarPerfilCliente, sairDaConta } from "@/app/actions/perfil-cliente"
import { toast } from "sonner"
import { Scissors, Loader2, LogOut, ArrowLeft } from "lucide-react"
import type { Cliente } from "@/lib/types"
import { barbearia } from "@/config/barbearia"

export function ContaView({ cliente }: { cliente: Cliente }) {
  const [nome, setNome] = useState(cliente.nome)
  const [whatsapp, setWhatsapp] = useState(cliente.whatsapp)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    const res = await atualizarPerfilCliente({ nome, whatsapp })
    setLoading(false)

    if (!res.ok) {
      toast.error(res.error ?? "Erro ao atualizar dados.")
      return
    }

    toast.success("Dados atualizados com sucesso!")
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
            <CardTitle className="font-serif text-2xl">Minha conta</CardTitle>
            <CardDescription>Veja e edite seus dados pessoais.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input id="email" value={cliente.email} disabled />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="nome">Nome</Label>
                  <Input id="nome" required value={nome} onChange={(e) => setNome(e.target.value)} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="whatsapp">WhatsApp</Label>
                  <Input
                    id="whatsapp"
                    required
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                  />
                </div>
                <Button type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Salvando...
                    </>
                  ) : (
                    "Salvar alterações"
                  )}
                </Button>
              </div>
            </form>
            <form action={sairDaConta} className="mt-3">
              <Button type="submit" variant="ghost" className="w-full text-muted-foreground">
                <LogOut className="h-4 w-4" /> Sair da conta
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
