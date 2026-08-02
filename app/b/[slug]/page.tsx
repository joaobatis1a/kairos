import { notFound } from "next/navigation"
import { LandingPage } from "@/components/landing-page"
import { getBarbeirosAtivos, getBarbeirosVitrine } from "@/app/actions/agendamentos"
import { getClienteAtual, getPerfilAtual } from "@/lib/auth"
import { getEmpresaPorSlug, getBarbeariaConfig, getServicos, getHorariosConfig } from "@/app/actions/config"
import { getStatusAbertura } from "@/lib/datas"

export const dynamic = "force-dynamic"

// barra do navegador no mobile acompanhando o fundo do app
export const viewport = { themeColor: "#0a0a0a" }

export default async function BarbeariaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const empresa = await getEmpresaPorSlug(slug)
  if (!empresa) notFound()

  const [barbeiros, barbeirosVitrine, cliente, perfil, config, servicos, horarios] = await Promise.all([
    getBarbeirosAtivos(empresa.id),
    getBarbeirosVitrine(empresa.id),
    getClienteAtual(),
    getPerfilAtual(),
    getBarbeariaConfig(empresa.id),
    getServicos(empresa.id),
    getHorariosConfig(empresa.id),
  ])

  return (
    <LandingPage
      companyId={empresa.id}
      barbeiros={barbeiros}
      barbeirosVitrine={barbeirosVitrine}
      cliente={cliente}
      isEquipe={!!perfil}
      config={config}
      servicos={servicos}
      horarios={horarios}
      statusAbertura={getStatusAbertura(horarios)}
    />
  )
}
