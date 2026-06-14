"use client"

import { Check, X } from "lucide-react"
import { cn } from "@/lib/utils"

export const REQUISITOS_SENHA = [
  { id: "tamanho", label: "Mínimo de 8 caracteres", test: (s: string) => s.length >= 8 },
  { id: "maiuscula", label: "Uma letra maiúscula", test: (s: string) => /[A-Z]/.test(s) },
  { id: "numero", label: "Um número", test: (s: string) => /[0-9]/.test(s) },
  { id: "especial", label: "Um caractere especial (!@#$%...)", test: (s: string) => /[^A-Za-z0-9]/.test(s) },
]

export function senhaValida(senha: string) {
  return REQUISITOS_SENHA.every((r) => r.test(senha))
}

export function PasswordRequisitos({ senha }: { senha: string }) {
  if (!senha) return null

  return (
    <ul className="mt-1 flex flex-col gap-1">
      {REQUISITOS_SENHA.map((req) => {
        const ok = req.test(senha)
        return (
          <li
            key={req.id}
            className={cn(
              "flex items-center gap-1.5 text-xs transition-colors",
              ok ? "text-green-500" : "text-muted-foreground",
            )}
          >
            {ok ? <Check className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5" />}
            {req.label}
          </li>
        )
      })}
    </ul>
  )
}
