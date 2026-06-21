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
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Scissors,
  LayoutDashboard,
  CalendarDays,
  CalendarCheck,
  Users,
  Settings,
  ShieldAlert,
  Star,
  User,
  LogOut,
  Menu,
  ChevronRight,
} from "lucide-react"

export function PainelNav({ perfil, nomeNegocio }: { perfil: Profile; nomeNegocio?: string }) {
  const nome = nomeNegocio || barbearia.nome
  const pathname = usePathname()
  const [aberto, setAberto] = useState(false)
  const [pending, startTransition] = useTransition()

  const isOwner = perfil.role === "owner"

  const links = isOwner
    ? [
        { href: "/painel", label: "Painel", icon: LayoutDashboard },
        { href: "/painel/agendamentos", label: "Agendamentos", icon: CalendarDays },
        { href: "/painel/equipe", label: "Equipe", icon: Users },
        { href: "/painel/avaliacoes", label: "Avaliações", icon: Star },
        { href: "/painel/gerenciamento", label: "Gerenciamento", icon: Settings },
        { href: "/painel/configuracoes", label: "Configurações", icon: ShieldAlert },
      ]
    : [
        { href: "/painel/agenda", label: "Minha agenda", icon: CalendarCheck },
        { href: "/painel/avaliacoes", label: "Avaliações", icon: Star },
      ]

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between border-b border-border bg-background/90 px-4 py-3 backdrop-blur">
      <div className="flex items-center gap-2">
        <Scissors className="h-5 w-5 text-primary" />
        <span className="font-serif font-semibold">{nome}</span>
      </div>

      <Sheet open={aberto} onOpenChange={setAberto}>
        <SheetTrigger
          render={
            <button className="inline-flex items-center gap-2 rounded-md border border-input bg-background px-3 py-1.5 text-sm font-medium shadow-sm transition-colors hover:bg-accent">
              <Menu className="h-4 w-4" />
              <span className="hidden sm:inline">{perfil.nome?.split(" ")[0] || "Menu"}</span>
            </button>
          }
        />
        <SheetContent side="right" className="w-80 p-0">
          <SheetHeader className="border-b border-border p-6 pb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/15 text-primary">
                <User className="h-6 w-6" />
              </div>
              <div className="text-left">
                <SheetTitle className="font-serif">{perfil.nome || "Usuário"}</SheetTitle>
                <p className="text-xs text-primary">{isOwner ? "Administrador" : "Barbeiro"}</p>
              </div>
            </div>
          </SheetHeader>

          <nav className="flex flex-col gap-1 p-4">
            {links.map((l) => {
              const ativo = pathname === l.href
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setAberto(false)}
                  className={cn(
                    "flex items-center justify-between rounded-lg p-3 transition-colors",
                    ativo
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted/60",
                  )}
                >
                  <div className="flex items-center gap-3">
                    <l.icon className="h-4 w-4" />
                    <span className="text-sm font-medium">{l.label}</span>
                  </div>
                  {!ativo && <ChevronRight className="h-4 w-4 text-muted-foreground" />}
                </Link>
              )
            })}
          </nav>

          <div className="mt-auto flex flex-col gap-2 p-4 pt-0">
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
        </SheetContent>
      </Sheet>
    </header>
  )
}
