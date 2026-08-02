import { getPerfilOuRedirect } from "@/lib/auth"
import { listarAvisos, listarEquipeParaAviso } from "@/app/actions/avisos"
import { AvisosView } from "@/components/painel/avisos-view"

export const dynamic = "force-dynamic"

export default async function AvisosPage() {
  const perfil = await getPerfilOuRedirect()
  const isOwner = perfil.role === "owner"

  const [avisos, equipe] = await Promise.all([
    listarAvisos(),
    isOwner ? listarEquipeParaAviso() : Promise.resolve([]),
  ])

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-serif text-3xl font-bold">Avisos</h1>
        <p className="text-muted-foreground">Mural de recados entre você e a equipe.</p>
      </div>

      <AvisosView avisos={avisos} equipe={equipe} isOwner={isOwner} />
    </div>
  )
}
