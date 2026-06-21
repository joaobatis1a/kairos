import { getPerfilOuRedirect } from "@/lib/auth"
import { redirect } from "next/navigation"
import { listarUsuariosParaTransferencia } from "@/app/actions/equipe"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { TransferirOwner } from "@/components/painel/transferir-owner"
import { DeletarConta } from "@/components/deletar-conta"

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

      {/* Zona de perigo */}
      <Card className="border-destructive/30">
        <CardHeader>
          <CardTitle className="font-serif text-destructive">Zona de perigo</CardTitle>
          <CardDescription>Ações irreversíveis. Proceda com cuidado.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <div>
            <p className="mb-2 text-sm font-medium">Transferir administrador</p>
            <p className="mb-3 text-xs text-muted-foreground">Passe o cargo para outro usuário. Sua conta vira cliente e você perde acesso ao painel.</p>
            <TransferirOwner usuarios={usuarios} />
          </div>
          <div className="border-t border-border pt-3">
            <p className="mb-2 text-sm font-medium">Deletar minha conta</p>
            <p className="mb-3 text-xs text-muted-foreground">Remove permanentemente sua conta. Transfira o cargo antes de deletar.</p>
            <DeletarConta />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
