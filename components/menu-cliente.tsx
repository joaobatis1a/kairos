"use client"

import { useState, useTransition } from "react"
import Link from "next/link"
import type { Cliente } from "@/lib/types"
import { sairDaConta } from "@/app/actions/perfil-cliente"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  ChevronRight,
  Menu,
  User,
  History,
  Settings,
  LayoutDashboard,
  LogOut,
} from "lucide-react"

export function MenuCliente({
  cliente,
  isEquipe = false,
}: {
  cliente: Cliente | null
  isEquipe?: boolean
}) {
  const [aberto, setAberto] = useState(false)
  const [pending, startTransition] = useTransition()

  if (!cliente && !isEquipe) {
    return (
      <Link
        href="/conta/login"
        className="inline-flex items-center gap-2 rounded-md border border-input bg-background px-3 py-1.5 text-sm font-medium shadow-sm transition-colors hover:bg-accent"
      >
        <User className="h-4 w-4" /> Entrar
      </Link>
    )
  }

  // Cliente com conta: itens normais de cliente.
  // Membro da equipe sem conta de cliente: só tem o próprio perfil (dados da equipe).
  const itens = cliente
    ? [
        { href: "/conta", label: "Perfil", icon: User },
        { href: "/conta/historico", label: "Histórico & Avaliações", icon: History },
        { href: "/conta/configuracoes", label: "Configurações", icon: Settings },
      ]
    : [{ href: "/painel/minha-conta", label: "Perfil", icon: User }]

  return (
    <Sheet open={aberto} onOpenChange={setAberto}>
      <SheetTrigger
        render={
          <button className="inline-flex items-center gap-2 rounded-md border border-input bg-background px-3 py-1.5 text-sm font-medium shadow-sm transition-colors hover:bg-accent">
            <Menu className="h-4 w-4" />
          </button>
        }
      />
      <SheetContent side="right" className="w-80 p-0">
        <SheetHeader className="border-b border-border p-6 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/15 text-primary">
              <User className="h-6 w-6" />
            </div>
            <SheetTitle className="font-serif">Menu</SheetTitle>
          </div>
        </SheetHeader>

        <nav className="flex flex-col gap-1 p-4">
          {itens.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setAberto(false)}
              className="flex items-center justify-between rounded-lg p-3 transition-colors hover:bg-muted/60"
            >
              <div className="flex items-center gap-3">
                <Icon className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">{label}</span>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </Link>
          ))}
        </nav>

        <div className="mt-auto flex flex-col gap-2 p-4 pt-0">
          {isEquipe && (
            <Button variant="outline" size="sm" asChild>
              <Link href="/painel" onClick={() => setAberto(false)}>
                <LayoutDashboard className="h-4 w-4" /> Voltar ao painel
              </Link>
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            className="justify-start text-muted-foreground"
            disabled={pending}
            onClick={() => startTransition(() => sairDaConta())}
          >
            <LogOut className="h-4 w-4" /> Sair da conta
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
