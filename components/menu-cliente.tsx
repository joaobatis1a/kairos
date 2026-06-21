"use client"

import { useState } from "react"
import Link from "next/link"
import type { Cliente } from "@/lib/types"
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger,
} from "@/components/ui/sheet"
import { ChevronRight, Menu, User, History, Settings } from "lucide-react"

export function MenuCliente({ cliente }: { cliente: Cliente | null }) {
  const [aberto, setAberto] = useState(false)

  if (!cliente) {
    return (
      <Link
        href="/conta/login"
        className="inline-flex items-center gap-2 rounded-md border border-input bg-background px-3 py-1.5 text-sm font-medium shadow-sm transition-colors hover:bg-accent"
      >
        <User className="h-4 w-4" /> Entrar
      </Link>
    )
  }

  const itens = [
    { href: "/conta", label: "Perfil", icon: User },
    { href: "/conta/historico", label: "Histórico & Avaliações", icon: History },
    { href: "/conta/configuracoes", label: "Configurações", icon: Settings },
  ]

  return (
    <Sheet open={aberto} onOpenChange={setAberto}>
      <SheetTrigger asChild>
        <button className="inline-flex items-center gap-2 rounded-md border border-input bg-background px-3 py-1.5 text-sm font-medium shadow-sm transition-colors hover:bg-accent">
          <Menu className="h-4 w-4" />
          <span className="hidden sm:inline">{cliente.nome.split(" ")[0]}</span>
        </button>
      </SheetTrigger>
      <SheetContent side="right" className="w-80 p-0">
        <SheetHeader className="p-6 pb-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/15 text-primary">
              <User className="h-6 w-6" />
            </div>
            <div className="text-left">
              <SheetTitle className="font-serif">{cliente.nome}</SheetTitle>
              <p className="text-xs text-muted-foreground">{cliente.email}</p>
            </div>
          </div>
        </SheetHeader>

        <nav className="flex flex-col p-4 gap-1">
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
      </SheetContent>
    </Sheet>
  )
}
