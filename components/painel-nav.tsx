"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTransition } from "react"
import { cn } from "@/lib/utils"
import { sair } from "@/app/actions/painel"
import { barbearia } from "@/config/barbearia"
import type { Profile } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { SinoNotificacoes } from "@/components/painel/sino-notificacoes"
import { ScissorMark } from "@/components/scissor-mark"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  LayoutDashboard,
  CalendarDays,
  CalendarCheck,
  Users,
  Settings,
  ShieldAlert,
  Star,
  History,
  ExternalLink,
  LogOut,
  Menu,
  Megaphone,
  LifeBuoy,
} from "lucide-react"

function linksPara(isOwner: boolean) {
  return isOwner
    ? [
        { href: "/painel", label: "Painel", icon: LayoutDashboard },
        { href: "/painel/agendamentos", label: "Agendamentos", icon: CalendarDays },
        { href: "/painel/equipe", label: "Equipe", icon: Users },
        { href: "/painel/avaliacoes", label: "Avaliações", icon: Star },
        { href: "/painel/avisos", label: "Avisos", icon: Megaphone },
        { href: "/painel/gerenciamento", label: "Gerenciamento", icon: Settings },
        { href: "/painel/auditoria", label: "Auditoria", icon: History },
        { href: "/painel/suporte", label: "Suporte", icon: LifeBuoy },
        { href: "/painel/configuracoes", label: "Configurações", icon: ShieldAlert },
      ]
    : [
        { href: "/painel/agenda", label: "Minha agenda", icon: CalendarCheck },
        { href: "/painel/avaliacoes", label: "Avaliações", icon: Star },
        { href: "/painel/avisos", label: "Avisos", icon: Megaphone },
      ]
}

function ItemNav({
  href,
  label,
  icon: Icon,
  ativo,
  onClick,
}: {
  href: string
  label: string
  icon: React.ElementType
  ativo: boolean
  onClick?: () => void
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
        ativo ? "text-foreground" : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
      )}
    >
      {ativo && <span className="absolute inset-0 rounded-lg bg-primary/10 ring-1 ring-primary/25" />}
      <span
        className={cn(
          "absolute left-0 top-1/2 h-5 w-[2.5px] -translate-y-1/2 rounded-full bg-primary transition-opacity",
          ativo ? "opacity-100" : "opacity-0",
        )}
      />
      <Icon className={cn("relative h-4 w-4 shrink-0", ativo && "text-primary")} />
      <span className="relative font-medium">{label}</span>
    </Link>
  )
}

function RodapeConta({ perfil, isOwner, slugEmpresa }: { perfil: Profile; isOwner: boolean; slugEmpresa?: string }) {
  const [pending, startTransition] = useTransition()

  return (
    <div className="flex flex-col gap-3 border-t border-border/60 p-3 pt-4">
      <div className="flex items-center gap-3 px-1">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/15 font-serif text-sm font-bold text-primary">
          {perfil.nome?.[0]?.toUpperCase() || "?"}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">{perfil.nome || "Usuário"}</p>
          <p className="text-xs text-primary">{isOwner ? "Administrador" : "Barbeiro"}</p>
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <Button variant="ghost" size="sm" asChild disabled={!slugEmpresa} className="justify-start text-muted-foreground">
          <Link href={slugEmpresa ? `/b/${slugEmpresa}` : "#"} target="_blank">
            <ExternalLink className="h-4 w-4" /> Ver site
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
}

export function PainelNav({ perfil, nomeNegocio, slugEmpresa }: { perfil: Profile; nomeNegocio?: string; slugEmpresa?: string }) {
  const nome = nomeNegocio || barbearia.nome
  const pathname = usePathname()
  const isOwner = perfil.role === "owner"
  const links = linksPara(isOwner)

  return (
    <>
      {/* Sidebar fixa no desktop */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-60 flex-col border-r border-border/60 bg-card/40 md:flex">
        <div className="flex items-center gap-2 px-5 py-5">
          <ScissorMark className="h-5 w-5 shrink-0 text-primary" />
          <span className="flex-1 truncate font-serif text-lg">{nome}</span>
          <SinoNotificacoes />
        </div>
        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-3">
          {links.map((l) => (
            <ItemNav key={l.href} {...l} ativo={pathname === l.href} />
          ))}
        </nav>
        <RodapeConta perfil={perfil} isOwner={isOwner} slugEmpresa={slugEmpresa} />
      </aside>

      {/* Barra + gaveta no mobile */}
      <MenuMobile perfil={perfil} nome={nome} links={links} pathname={pathname} isOwner={isOwner} slugEmpresa={slugEmpresa} />
    </>
  )
}

function MenuMobile({
  perfil,
  nome,
  links,
  pathname,
  isOwner,
  slugEmpresa,
}: {
  perfil: Profile
  nome: string
  links: ReturnType<typeof linksPara>
  pathname: string
  isOwner: boolean
  slugEmpresa?: string
}) {
  return (
    <header className="sticky top-0 z-40 flex items-center justify-between border-b border-border/60 bg-background/90 px-4 py-3 backdrop-blur md:hidden">
      <div className="flex items-center gap-2">
        <ScissorMark className="h-5 w-5 text-primary" />
        <span className="font-serif font-semibold">{nome}</span>
      </div>

      <div className="flex items-center gap-1">
        <SinoNotificacoes />
        <Sheet>
          <SheetTrigger
            render={
              <button className="inline-flex items-center gap-2 rounded-md border border-input bg-background px-3 py-1.5 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-muted">
                <Menu className="h-4 w-4" />
                <span>{perfil.nome?.split(" ")[0] || "Menu"}</span>
              </button>
            }
          />
          <SheetContent side="right" className="flex w-72 flex-col p-0">
            <SheetHeader className="border-b border-border/60 p-5 pb-4">
              <SheetTitle className="font-serif">{nome}</SheetTitle>
            </SheetHeader>
            <nav className="flex flex-1 flex-col gap-1 p-3">
              {links.map((l) => (
                <ItemNav key={l.href} {...l} ativo={pathname === l.href} />
              ))}
            </nav>
            <RodapeConta perfil={perfil} isOwner={isOwner} slugEmpresa={slugEmpresa} />
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
