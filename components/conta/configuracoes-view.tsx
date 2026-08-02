"use client"

import { useEffect, useState } from "react"
import { useTheme } from "next-themes"
import { DeletarConta } from "@/components/deletar-conta"
import { Palette, Sun, Moon, TriangleAlert, Check } from "lucide-react"
import type { Cliente } from "@/lib/types"

function Secao({
  icon: Icon,
  titulo,
  descricao,
  children,
  perigo = false,
}: {
  icon: React.ElementType
  titulo: string
  descricao?: string
  children: React.ReactNode
  perigo?: boolean
}) {
  return (
    <section
      className={`rounded-2xl border bg-card p-5 ${perigo ? "border-destructive/30" : "border-border"}`}
    >
      <div className="flex items-start gap-3">
        <span
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
            perigo ? "bg-destructive/15 text-destructive" : "bg-primary/15 text-primary"
          }`}
        >
          <Icon className="h-4 w-4" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <h2 className={`font-serif text-lg font-semibold ${perigo ? "text-destructive" : ""}`}>
            {titulo}
          </h2>
          {descricao && <p className="mt-0.5 text-sm text-muted-foreground">{descricao}</p>}
          <div className="mt-4">{children}</div>
        </div>
      </div>
    </section>
  )
}

/** Preferências do aparelho e ações de conta. */
export function ConfiguracoesView({ cliente }: { cliente: Cliente }) {
  const { theme, setTheme } = useTheme()
  const [montado, setMontado] = useState(false)

  // o tema só é conhecido no cliente; renderizar antes disso causaria
  // divergência de hidratação
  useEffect(() => setMontado(true), [])

  return (
    <div className="surgir flex flex-col gap-4">
      <Secao icon={Palette} titulo="Aparência" descricao="Vale só para este aparelho.">
        {montado ? (
          <div className="flex flex-wrap gap-3">
            {[
              { id: "light", label: "Claro", icon: Sun },
              { id: "dark", label: "Escuro", icon: Moon },
            ].map(({ id, label, icon: Icon }) => {
              const ativo = theme === id
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setTheme(id)}
                  aria-pressed={ativo}
                  className={`flex min-w-[9rem] flex-1 items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                    ativo
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <Icon className="h-4 w-4" aria-hidden />
                  {label}
                  {ativo && <Check className="h-4 w-4" aria-hidden />}
                </button>
              )
            })}
          </div>
        ) : (
          <div className="h-[50px]" aria-hidden />
        )}
      </Secao>

      <Secao
        icon={TriangleAlert}
        titulo="Excluir conta"
        descricao={`Apaga a conta de ${cliente.email} e todo o histórico. Não dá para desfazer.`}
        perigo
      >
        <DeletarConta />
      </Secao>
    </div>
  )
}
