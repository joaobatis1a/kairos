import { getPerfilOuRedirect } from "@/lib/auth"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { DeletarConta } from "@/components/deletar-conta"
import { User } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function MinhaContaPage() {
  const perfil = await getPerfilOuRedirect()

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-serif text-3xl font-bold">Minha conta</h1>
        <p className="text-muted-foreground">Gerencie suas informações pessoais.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-serif">Perfil</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/15 text-primary">
            <User className="h-6 w-6" />
          </div>
          <div>
            <p className="font-medium">{perfil.nome}</p>
            <p className="text-sm text-muted-foreground capitalize">{perfil.role === "owner" ? "Administrador" : "Barbeiro"}</p>
          </div>
        </CardContent>
      </Card>

      <Card className="border-destructive/30">
        <CardHeader>
          <CardTitle className="font-serif text-destructive">Zona de perigo</CardTitle>
          <CardDescription>Esta ação é permanente e não pode ser desfeita.</CardDescription>
        </CardHeader>
        <CardContent>
          <DeletarConta />
        </CardContent>
      </Card>
    </div>
  )
}
