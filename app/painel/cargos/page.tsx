import { redirect } from "next/navigation"
import { getPerfilOuRedirect } from "@/lib/auth"
import { getPermissoesEquipe } from "@/app/actions/permissoes"
import { listarEquipe } from "@/app/actions/equipe"
import { CargosView } from "@/components/painel/cargos-view"

export const dynamic = "force-dynamic"

export default async function CargosPage() {
  const perfil = await getPerfilOuRedirect()
  if (perfil.role !== "owner") redirect("/painel/agenda")

  const [permissoes, equipe] = await Promise.all([
    getPermissoesEquipe(perfil.company_id),
    listarEquipe(),
  ])
  const totalBarbeiros = equipe.filter((p) => p.role === "barber" && p.ativo).length

  return <CargosView permissoesIniciais={permissoes} totalBarbeiros={totalBarbeiros} />
}
