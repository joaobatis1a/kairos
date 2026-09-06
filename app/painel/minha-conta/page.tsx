import { getPerfilOuRedirect } from "@/lib/auth"
import { getFotoPerfil } from "@/app/actions/avatar"
import { PerfilEquipeView } from "@/components/perfil-equipe-view"

export const dynamic = "force-dynamic"

export default async function MinhaContaPage() {
  const [perfil, fotoUrl] = await Promise.all([getPerfilOuRedirect(), getFotoPerfil()])
  return <PerfilEquipeView perfil={perfil} fotoUrl={fotoUrl} />
}
