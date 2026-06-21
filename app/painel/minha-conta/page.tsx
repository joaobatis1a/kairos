import { getPerfilOuRedirect } from "@/lib/auth"
import { PerfilEquipeView } from "@/components/perfil-equipe-view"

export const dynamic = "force-dynamic"

export default async function MinhaContaPage() {
  const perfil = await getPerfilOuRedirect()
  return <PerfilEquipeView perfil={perfil} />
}
