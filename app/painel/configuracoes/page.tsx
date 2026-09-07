import { getPerfilOuRedirect } from "@/lib/auth"
import { redirect } from "next/navigation"
import { listarUsuariosParaTransferencia } from "@/app/actions/equipe"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { TransferirOwner } from "@/components/painel/transferir-owner"
import { DeletarConta } from "@/components/deletar-conta"
import { AlertTriangle } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function ConfiguracoesPage() {
  const perfil = await getPerfilOuRedirect()
  if (perfil.role !== "owner") redirect("/painel")

  const usuarios = await listarUsuariosParaTransferencia()

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-serif text-3xl font-bold">Configurações</h1>
        <p className="text-muted-foreground">Ações de administração da sua conta.</p>
      </div>

      <Card className="border-destructive/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-serif text-destructive">
            <AlertTriangle className="h-4 w-4" /> Zona de perigo
          </CardTitle>
          <CardDescription>Ações irreversíveis. Proceda com cuidado.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col divide-y divide-destructive/15 p-0">
          <div className="flex flex-col items-start gap-3 px-6 pt-2 pb-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium">Transferir administrador</p>
              <p className="text-xs text-muted-foreground">
                Passe o cargo para outro usuário. Sua conta vira cliente e você perde acesso ao painel.
              </p>
            </div>
            <div className="shrink-0">
              <TransferirOwner usuarios={usuarios} />
            </div>
          </div>

          <div className="flex flex-col items-start gap-3 px-6 pt-4 pb-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium">Deletar minha conta</p>
              <p className="text-xs text-muted-foreground">
                Remove permanentemente sua conta. Transfira o cargo antes de deletar.
              </p>
            </div>
            <div className="shrink-0">
              <DeletarConta />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
