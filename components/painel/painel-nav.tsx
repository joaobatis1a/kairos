"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useTransition } from "react"
import { cn } from "@/lib/utils"
import { sair } from "@/app/actions/painel"
import { barbearia } from "@/config/barbearia"
import type { Profile } from "@/lib/types"
import { Button } from "@/components/ui/button"
import {
  Scissors,
  LayoutDashboard,
  CalendarDays,
  Users,
  Settings,
  CalendarCheck,
  LogOut,
  Menu,
  X,
} from "lucide-react"

export function PainelNav({ perfil, nomeNegocio }: { perfil: Profile; nomeNegocio?: string }) {
  const nome = nomeNegocio || barbearia.nome
  const pathname = usePathname()
  const [aberto, setAberto] = useState(false)
  const [pending, startTransition] = useTransition()

  const isOwner = perfil.role === "owner"

  const links = isOwner
    ? [
        { href: "/painel", label: "Visão geral", icon: LayoutDashboard },
        { href: "/painel/agendamentos", label: "Agendamentos", icon: CalendarDays },
        { href: "/painel/equipe", label: "Equipe", icon: Users },
        { href: "/painel/config", label: "Configurações", icon: Settings },
      ]
    : [
        { href: "/painel", label: "Visão geral", icon: LayoutDashboard },
        { href: "/painel/agenda", label: "Minha agenda", icon: CalendarCheck },
      ]

  const conteudo = (
    <div className="flex h-full flex-col gap-1">
      <div className="mb-4 flex items-center gap-2 px-2">
        <Scissors className="h-5 w-5 text-primary" />
        <span className="font-serif text-lg font-semibold">{nome}</span>
      </div>

      <div className="mb-3 rounded-lg border border-border bg-muted/40 p-3">
        <p className="truncate text-sm font-medium">{perfil.nome || "Usuário"}</p>
        <p className="text-xs text-primary">{isOwner ? "Administrador" : "Barbeiro"}</p>
      </div>

      <nav className="flex flex-col gap-1">
        {links.map((l) => {
          const ativo = pathname === l.href
          return (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setAberto(false)}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                ativo
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <l.icon className="h-4 w-4" />
              {l.label}
            </Link>
          )
        })}
      </nav>

      <div className="mt-auto flex flex-col gap-2 pt-4">
        <Button variant="outline" size="sm" asChild>
          <Link href="/" target="_blank">
            Ver site
          </Link>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="justify-start text-muted-foreground"
          disabled={pending}
          onClick={() => startTransition(() => sair())}
        >
          <LogOut className="h-4 w-4" /> Sair
        </Button>
      </div>
    </div>
  )

  return (
    <>
      {/* Topbar mobile */}
      <div className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-background/90 px-4 py-3 backdrop-blur md:hidden">
        <div className="flex items-center gap-2">
          <Scissors className="h-5 w-5 text-primary" />
          <span className="font-serif font-semibold">{nome}</span>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setAberto(true)} aria-label="Abrir menu">
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      {/* Sidebar desktop */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-border bg-sidebar p-4 md:block">
        {conteudo}
      </aside>

      {/* Drawer mobile */}
      {aberto && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-background/70"
            onClick={() => setAberto(false)}
            aria-hidden
          />
          <aside className="absolute inset-y-0 left-0 w-72 border-r border-border bg-sidebar p-4">
            <div className="mb-2 flex justify-end">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setAberto(false)}
                aria-label="Fechar menu"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            {conteudo}
          </aside>
        </div>
      )}
    </>
  )
}
