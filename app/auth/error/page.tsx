"use client"

import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"
import { Suspense } from "react"

function AuthErrorContent() {
  const searchParams = useSearchParams()
  const reason = searchParams.get("reason")

  const isSemPerfil = reason === "sem_perfil"

  return (
    <div className="flex min-h-svh w-full items-center justify-center bg-background p-6">
      <Card className="w-full max-w-sm">
        <CardHeader className="items-center text-center">
          <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/15 text-destructive">
            <AlertCircle className="h-6 w-6" />
          </div>
          <CardTitle className="font-serif text-2xl">
            {isSemPerfil ? "Acesso não autorizado" : "Algo deu errado"}
          </CardTitle>
          <CardDescription>
            {isSemPerfil
              ? "Esta conta Google não possui um perfil de equipe cadastrado. Entre em contato com o administrador."
              : "Não foi possível concluir a autenticação. Tente entrar novamente."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild className="w-full">
            <Link href="/auth/login">Voltar ao login</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

export default function AuthErrorPage() {
  return (
    <Suspense>
      <AuthErrorContent />
    </Suspense>
  )
}
