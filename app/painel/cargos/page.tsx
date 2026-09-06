import { redirect } from "next/navigation"
import { getPerfilOuRedirect } from "@/lib/auth"
import { getPermissoesEquipe } from "@/app/actions/permissoes"
import { CargosView } from "@/components/painel/cargos-view"

export const dynamic = "force-dynamic"

export default async function CargosPage() {
  const perfil = await getPerfilOuRedirect()
  if (perfil.role !== "owner") redirect("/painel/agenda")

  const permissoes = await getPermissoesEquipe(perfil.company_id)
  return <CargosView permissoesIniciais={permissoes} />
}
