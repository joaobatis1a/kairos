"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTransition } from "react"
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
import { Scissors, Building2, ShieldCheck, LogOut, Menu } from "lucide-react"

const LINKS = [
  { href: "/manutencao", label: "Empresas", icon: Building2 },
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

function RodapeConta({ email }: { email: string }) {
  const [pending, startTransition] = useTransition()

  return (
    <div className="flex flex-col gap-3 border-t border-border/60 p-3 pt-4">
      <div className="flex items-center gap-3 px-1">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/15 font-serif text-sm font-bold text-primary">
          {email[0]?.toUpperCase() || "?"}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">{email}</p>
          <p className="text-xs text-primary">Manutenção</p>
        </div>
      </div>
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
  )
}

export function ManutencaoNav({ email }: { email: string }) {
  const pathname = usePathname()

  return (
    <>
      {/* Sidebar fixa no desktop */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-60 flex-col border-r border-border/60 bg-card/40 md:flex">
        <div className="flex items-center gap-2 px-5 py-5">
          <Scissors className="h-5 w-5 shrink-0 text-primary" />
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
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-border/60 bg-background/90 px-4 py-3 backdrop-blur md:hidden">
        <div className="flex items-center gap-2">
          <Scissors className="h-5 w-5 text-primary" />
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
