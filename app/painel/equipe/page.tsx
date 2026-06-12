import { getPerfilOuRedirect } from "@/lib/auth"
import { listarEquipe } from "@/app/actions/equipe"
import { redirect } from "next/navigation"
import { EquipeView } from "@/components/painel/equipe-view"
import type { Profile } from "@/lib/types"

export const dynamic = "force-dynamic"

export default async function EquipePage() {
  const perfil = await getPerfilOuRedirect()
  if (perfil.role !== "owner") redirect("/painel")

  const equipe = (await listarEquipe()) as Profile[]
  return <EquipeView equipe={equipe} ownerId={perfil.id} />
}
