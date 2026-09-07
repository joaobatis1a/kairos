"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useTransition } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { sair } from "@/app/actions/painel"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Building2, ShieldCheck, LifeBuoy, LogOut, Menu, User, ChevronUp } from "lucide-react"
import { ScissorMark } from "@/components/scissor-mark"

const LINKS = [
  { href: "/manutencao", label: "Empresas", icon: Building2 },
  { href: "/manutencao/suporte", label: "Suporte", icon: LifeBuoy },
  { href: "/manutencao/equipe", label: "Equipe de manutenção", icon: ShieldCheck },
]

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

/** Clicar no e-mail/avatar abre um popup com "Meu perfil" e "Sair" — mesmo
 * padrão do painel de dono/equipe (components/painel-nav.tsx). A conta de
 * manutenção também é uma conta de cliente (o e-mail só ganha o acesso extra
 * a /manutencao via allowlist), então "Meu perfil" leva pro perfil de
 * cliente de sempre: nome, WhatsApp, tema e troca de senha. */
function RodapeConta({ email }: { email: string }) {
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
          {email[0]?.toUpperCase() || "?"}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">{email}</p>
          <p className="text-xs text-primary">Manutenção</p>
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
                <Link href="/conta/perfil">
                  <User className="h-4 w-4" /> Meu perfil
                </Link>
              </Button>
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

export function ManutencaoNav({ email }: { email: string }) {
  const pathname = usePathname()

  return (
    <>
      {/* Sidebar fixa no desktop */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-60 flex-col border-r border-border/60 bg-card/40 md:flex">
        <div className="flex items-center gap-2 px-5 py-5">
          <ScissorMark className="h-5 w-5 shrink-0 text-primary" />
          <span className="font-serif text-lg">kairos</span>
        </div>
        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-3">
          {LINKS.map((l) => (
            <ItemNav key={l.href} {...l} ativo={pathname === l.href} />
          ))}
        </nav>
        <RodapeConta email={email} />
      </aside>

      {/* Barra + gaveta no mobile */}
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-border/60 bg-background px-4 py-3 md:hidden">
        <div className="flex items-center gap-2">
          <ScissorMark className="h-5 w-5 text-primary" />
          <span className="font-serif font-semibold">kairos · Manutenção</span>
        </div>

        <Sheet>
          <SheetTrigger
            render={
              <button className="inline-flex items-center gap-2 rounded-md border border-input bg-background px-3 py-1.5 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-muted">
                <Menu className="h-4 w-4" />
              </button>
            }
          />
          <SheetContent side="right" className="flex w-72 flex-col p-0">
            <SheetHeader className="border-b border-border/60 p-5 pb-4">
              <SheetTitle className="font-serif">kairos</SheetTitle>
            </SheetHeader>
            <nav className="flex flex-1 flex-col gap-1 p-3">
              {LINKS.map((l) => (
                <ItemNav key={l.href} {...l} ativo={pathname === l.href} />
              ))}
            </nav>
            <RodapeConta email={email} />
          </SheetContent>
        </Sheet>
      </header>
    </>
  )
}
