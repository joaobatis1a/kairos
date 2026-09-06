"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useTransition } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { sair } from "@/app/actions/painel"
import type { Profile } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { SinoNotificacoes } from "@/components/painel/sino-notificacoes"
import { ThemeTogglePainel } from "@/components/painel/theme-toggle-painel"
import { ScissorMark } from "@/components/scissor-mark"
import { DEMO_MODE } from "@/lib/demo"
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
  ExternalLink,
  LogOut,
  Menu,
  LifeBuoy,
  User,
  ChevronUp,
  KeyRound,
} from "lucide-react"

function linksPara(isOwner: boolean) {
  return isOwner
    ? [
        { href: "/painel", label: "Painel", icon: LayoutDashboard },
        { href: "/painel/agendamentos", label: "Agendamentos", icon: CalendarDays },
        { href: "/painel/equipe", label: "Equipe", icon: Users },
        { href: "/painel/avaliacoes", label: "Avaliações", icon: Star },
        { href: "/painel/gerenciamento", label: "Gerenciamento", icon: Settings },
        { href: "/painel/cargos", label: "Cargos e permissões", icon: KeyRound },
        { href: "/painel/suporte", label: "Suporte", icon: LifeBuoy },
        { href: "/painel/configuracoes", label: "Configurações", icon: ShieldAlert },
      ]
    : [
        { href: "/painel/agenda", label: "Minha agenda", icon: CalendarCheck },
        { href: "/painel/avaliacoes", label: "Avaliações", icon: Star },
        { href: "/painel/suporte", label: "Suporte", icon: LifeBuoy },
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

/** Clicar no avatar/nome abre um popup com "Meu perfil" e "Sair" — mesmo
 * padrão do práxis (footer da sidebar é um gatilho, não uma lista de botões
 * já visível). "Ver site" mora na barra de cima no desktop; só repete aqui
 * dentro da gaveta mobile, que não tem essa barra. */
function RodapeConta({
  perfil,
  isOwner,
  slugEmpresa,
  mostrarVerSite = false,
}: {
  perfil: Profile
  isOwner: boolean
  slugEmpresa?: string
  mostrarVerSite?: boolean
}) {
  const [pending, startTransition] = useTransition()
  const [aberto, setAberto] = useState(false)

  return (
    <div className="relative border-t border-border/60 p-3">
      <motion.button
        type="button"
        onClick={() => setAberto((v) => !v)}
        whileTap={{ scale: 0.98 }}
        className="flex w-full items-center gap-2.5 rounded-lg p-1.5 text-left transition-colors hover:bg-muted/60"
      >
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/15 font-serif text-sm font-bold text-primary">
          {perfil.nome?.[0]?.toUpperCase() || "?"}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">{perfil.nome || "Usuário"}</p>
          <p className="text-xs text-primary">{isOwner ? "Administrador" : "Barbeiro"}</p>
        </div>
        <motion.span
          animate={{ rotate: aberto ? 180 : 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 24 }}
          className="shrink-0 text-muted-foreground"
        >
          <ChevronUp className="h-4 w-4" />
        </motion.span>
      </motion.button>

      <AnimatePresence>
        {aberto && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setAberto(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 8, transition: { duration: 0.12 } }}
              transition={{ type: "spring", stiffness: 420, damping: 30 }}
              className="absolute bottom-full left-3 right-3 z-20 mb-2 rounded-lg border border-border bg-card p-1.5 shadow-lg"
            >
              <Button variant="ghost" size="sm" asChild className="w-full justify-start text-muted-foreground" onClick={() => setAberto(false)}>
                <Link href="/painel/minha-conta">
                  <User className="h-4 w-4" /> Meu perfil
                </Link>
              </Button>
              {mostrarVerSite && (
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                  disabled={!slugEmpresa}
                  className="w-full justify-start text-muted-foreground"
                  onClick={() => setAberto(false)}
                >
                  <Link href={slugEmpresa ? `/b/${slugEmpresa}` : "#"} target="_blank">
                    <ExternalLink className="h-4 w-4" /> Ver site
                  </Link>
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start text-destructive hover:text-destructive"
                disabled={pending}
                onClick={() => startTransition(() => sair())}
              >
                <LogOut className="h-4 w-4" /> Sair
              </Button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

/** Barra utilitária acima do conteúdo (desktop): site público, notificações
 * e tema — separada da navegação (sidebar) e da conta (rodapé), mesmo
 * corte que o práxis usa (cabeçalho próprio ao lado do toggle de tema). */
export function PainelTopBar({ slugEmpresa }: { slugEmpresa?: string }) {
  return (
    <div className="sticky top-0 z-30 hidden items-center justify-end gap-1 border-b border-border/60 bg-background/90 px-6 py-2 backdrop-blur md:flex">
      {DEMO_MODE && (
        <Link
          href="/conta/login"
          className="mr-auto text-xs font-medium text-primary underline underline-offset-2 hover:text-primary/80"
        >
          Ver como cliente
        </Link>
      )}
      <Button variant="ghost" size="sm" asChild disabled={!slugEmpresa} className="text-muted-foreground">
        <Link href={slugEmpresa ? `/b/${slugEmpresa}` : "#"} target="_blank">
          <ExternalLink className="h-4 w-4" /> Ver site
        </Link>
      </Button>
      <SinoNotificacoes />
      <ThemeTogglePainel />
    </div>
  )
}

export function PainelNav({ perfil, nomeNegocio, slugEmpresa }: { perfil: Profile; nomeNegocio?: string; slugEmpresa?: string }) {
  const nome = nomeNegocio || "Minha Barbearia"
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
        <ThemeTogglePainel />
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
            <RodapeConta perfil={perfil} isOwner={isOwner} slugEmpresa={slugEmpresa} mostrarVerSite />
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
