"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTransition } from "react"
import { cn } from "@/lib/utils"
import { sairDaConta } from "@/app/actions/perfil-cliente"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import {
  CalendarDays, History, User, Settings, LogOut, ChevronDown, LayoutDashboard,
} from "lucide-react"
import type { Cliente } from "@/lib/types"

export const SECOES_CONTA = [
  { href: "/conta", label: "Agendamentos", icon: CalendarDays },
  { href: "/conta/historico", label: "Histórico", icon: History },
  { href: "/conta/perfil", label: "Meu perfil", icon: User },
  { href: "/conta/configuracoes", label: "Configurações", icon: Settings },
]

/**
 * Menu da conta do cliente — o mesmo no storefront e na área do cliente.
 *
 * Antes eram dois: gaveta lateral no storefront e lista na área do cliente.
 * Mesma função, comportamentos diferentes, sem motivo.
 */
export function MenuConta({
  cliente,
  fotoUrl = null,
  isEquipe = false,
}: {
  cliente: Cliente | null
  fotoUrl?: string | null
  isEquipe?: boolean
}) {
  const pathname = usePathname()
  const [pending, startTransition] = useTransition()

  if (!cliente && !isEquipe) {
    return (
      <Link
        href="/conta/login"
        className="inline-flex items-center gap-2 rounded-full border border-input bg-background px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <User className="h-4 w-4" aria-hidden /> Entrar
      </Link>
    )
  }

  const nome = cliente?.nome ?? "Minha conta"
  const inicial = nome.trim()[0]?.toUpperCase() || "?"

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <button
            aria-label="Abrir menu da conta"
            className="group inline-flex items-center gap-2 rounded-full border border-input bg-background p-1 text-sm font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:pr-3"
          >
            <Avatar className="h-8 w-8 shrink-0">
              {fotoUrl && <AvatarImage src={fotoUrl} alt="" className="object-cover" />}
              <AvatarFallback className="bg-primary/15 text-sm font-bold text-primary">
                {inicial}
              </AvatarFallback>
            </Avatar>
            <span className="hidden max-w-[8rem] truncate sm:inline">
              {nome.trim().split(" ")[0]}
            </span>
            <ChevronDown
              className="hidden h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 group-data-[popup-open]:rotate-180 sm:inline"
              aria-hidden
            />
          </button>
        }
      />

      <DropdownMenuContent align="end" sideOffset={10} className="w-[17rem] p-2">
        <div className="flex items-center gap-3 rounded-xl bg-muted/40 p-3">
          <Avatar className="h-11 w-11 shrink-0">
            {fotoUrl && <AvatarImage src={fotoUrl} alt="" className="object-cover" />}
            <AvatarFallback className="bg-primary/15 font-serif text-lg font-bold text-primary">
              {inicial}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate font-serif font-semibold leading-tight">{nome}</p>
            {cliente?.email && (
              <p className="truncate text-xs text-muted-foreground">{cliente.email}</p>
            )}
          </div>
        </div>

        {cliente && (
          <div className="mt-2 flex flex-col gap-0.5">
            {SECOES_CONTA.map(({ href, label, icon: Icon }) => {
              const ativo = pathname === href
              return (
                <DropdownMenuItem
                  key={href}
                  className="p-0 focus:bg-transparent focus:text-inherit not-data-[variant=destructive]:focus:**:text-inherit data-highlighted:bg-transparent"
                  render={
                    <Link
                      href={href}
                      className={cn(
                        "group/item flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                        ativo
                          ? "bg-primary/10 font-semibold text-primary"
                          : "text-foreground hover:bg-muted/60",
                      )}
                    >
                      <Icon
                        className={cn(
                          "h-4 w-4 shrink-0 transition-transform duration-200 group-hover/item:scale-110",
                          ativo ? "text-primary" : "text-muted-foreground",
                        )}
                        aria-hidden
                      />
                      <span className="flex-1">{label}</span>
                      {ativo && (
                        <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden />
                      )}
                    </Link>
                  }
                />
              )
            })}
          </div>
        )}

        {isEquipe && (
          <div className="mt-2 flex flex-col gap-0.5">
            <DropdownMenuItem
              className="p-0 focus:bg-transparent focus:text-inherit not-data-[variant=destructive]:focus:**:text-inherit data-highlighted:bg-transparent"
              render={
                <Link
                  href="/painel"
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors hover:bg-muted/60"
                >
                  <LayoutDashboard className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
                  Voltar ao painel
                </Link>
              }
            />
          </div>
        )}

        <DropdownMenuSeparator className="my-2" />
        <DropdownMenuItem
          disabled={pending}
          className="rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition-colors"
          onClick={() => startTransition(() => sairDaConta())}
        >
          <LogOut className="h-4 w-4 shrink-0" aria-hidden />
          Sair da conta
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
