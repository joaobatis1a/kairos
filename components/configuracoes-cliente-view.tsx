"use client"

import Link from "next/link"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { DeletarConta } from "@/components/deletar-conta"
import { sairDaConta } from "@/app/actions/perfil-cliente"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ArrowLeft, Sun, Moon, LogOut, Trash2 } from "lucide-react"
import type { Cliente } from "@/lib/types"

export function ConfiguracoesClienteView({ cliente }: { cliente: Cliente }) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  return (
    <div className="flex min-h-svh w-full flex-col bg-background">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-2xl items-center gap-3 px-4">
          <Link href="/" className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="font-serif text-lg font-semibold">Configurações</h1>
        </div>
      </header>

      <main className="mx-auto w-full max-w-2xl px-4 py-6 flex flex-col gap-4">
        {/* Tema */}
        <Card>
          <CardHeader>
            <CardTitle className="font-serif">Aparência</CardTitle>
            <CardDescription>Escolha como o app aparece para você.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {mounted && (
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setTheme("light")}
                  className={`flex flex-col items-center gap-2 rounded-xl border p-4 transition-colors ${
                    theme === "light" ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"
                  }`}
                >
                  <Sun className={`h-6 w-6 ${theme === "light" ? "text-primary" : "text-muted-foreground"}`} />
                  <span className="text-sm font-medium">Claro</span>
                </button>
                <button
                  onClick={() => setTheme("dark")}
                  className={`flex flex-col items-center gap-2 rounded-xl border p-4 transition-colors ${
                    theme === "dark" ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"
                  }`}
                >
                  <Moon className={`h-6 w-6 ${theme === "dark" ? "text-primary" : "text-muted-foreground"}`} />
                  <span className="text-sm font-medium">Escuro</span>
                </button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Conta */}
        <Card className="border-destructive/30">
          <CardHeader>
            <CardTitle className="font-serif text-destructive">Zona de perigo</CardTitle>
            <CardDescription>Ações permanentes e irreversíveis.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <form action={sairDaConta}>
              <Button type="submit" variant="outline" className="w-full">
                <LogOut className="h-4 w-4" /> Sair da conta
              </Button>
            </form>
            <DeletarConta />
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
