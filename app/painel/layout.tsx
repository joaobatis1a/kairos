import { getPerfilOuRedirect } from "@/lib/auth"
import { PainelNav, PainelTopBar } from "@/components/painel-nav"
import { SessaoTempoReal } from "@/components/sessao-tempo-real"
import { getBarbeariaConfig } from "@/app/actions/config"

export const dynamic = "force-dynamic"

export default async function PainelLayout({ children }: { children: React.ReactNode }) {
  const perfil = await getPerfilOuRedirect()
  const config = await getBarbeariaConfig(perfil.company_id)

  return (
    <div className="min-h-screen bg-background">
      <SessaoTempoReal perfilId={perfil.id} companyId={perfil.company_id} />
      <PainelNav perfil={perfil} nomeNegocio={config.nome} slugEmpresa={config.slug} />
      <main id="conteudo" tabIndex={-1} className="md:pl-60">
        <PainelTopBar slugEmpresa={config.slug} />
        <div className="mx-auto max-w-5xl px-4 py-6 md:px-10 md:py-10">{children}</div>
      </main>
    </div>
  )
}
