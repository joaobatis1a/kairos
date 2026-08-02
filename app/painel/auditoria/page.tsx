import { redirect } from "next/navigation"
import { getPerfilOuRedirect } from "@/lib/auth"
import { listarAuditoria } from "@/lib/auditoria"
import { AuditoriaView } from "@/components/painel/auditoria-view"

export const dynamic = "force-dynamic"

export default async function AuditoriaPage() {
  const perfil = await getPerfilOuRedirect()
  if (perfil.role !== "owner") redirect("/painel")

  const entradas = await listarAuditoria(perfil.company_id)

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-serif text-3xl font-bold">Auditoria</h1>
        <p className="text-muted-foreground">Histórico de ações sensíveis da sua barbearia.</p>
      </div>

      <AuditoriaView entradas={entradas} />
    </div>
  )
}
