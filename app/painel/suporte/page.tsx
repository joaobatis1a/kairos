import { getPerfilOuRedirect } from "@/lib/auth"
import { listarChamados } from "@/app/actions/suporte"
import { SuporteView } from "@/components/painel/suporte-view"

export const dynamic = "force-dynamic"

export default async function SuportePage() {
  await getPerfilOuRedirect()
  const chamados = await listarChamados()

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-serif text-3xl font-bold">Suporte</h1>
        <p className="text-muted-foreground">Abra um chamado e fale direto com a equipe do kairos.</p>
      </div>

      <SuporteView chamadosIniciais={chamados} />
    </div>
  )
}
