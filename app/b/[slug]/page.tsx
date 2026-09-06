import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { LandingPage } from "@/components/landing-page"
import { getBarbeirosAtivos, getBarbeirosVitrine } from "@/app/actions/agendamentos"
import { getClienteAtual, getPerfilAtual } from "@/lib/auth"
import { getEmpresaPorSlug, getBarbeariaConfig, getServicos, getProdutos, getHorariosConfig } from "@/app/actions/config"
import { getStatusAbertura } from "@/lib/datas"

export const dynamic = "force-dynamic"

// barra do navegador no mobile acompanhando o fundo do app
export const viewport = { themeColor: "#0a0a0a" }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const empresa = await getEmpresaPorSlug(slug)
  if (!empresa) return { title: "Barbearia não encontrada" }

  const config = await getBarbeariaConfig(empresa.id)
  const titulo = config.nome
  const descricao =
    config.slogan?.trim() ||
    config.descricao?.trim() ||
    `Agende seu horário na ${config.nome}.`

  return {
    title: titulo,
    description: descricao,
    openGraph: {
      title: titulo,
      description: descricao,
      type: "website",
      images: config.logo_url ? [{ url: config.logo_url }] : undefined,
    },
    twitter: {
      card: "summary",
      title: titulo,
      description: descricao,
    },
  }
}

export default async function BarbeariaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const empresa = await getEmpresaPorSlug(slug)
  if (!empresa) notFound()

  const [barbeiros, barbeirosVitrine, cliente, perfil, config, servicos, produtos, horarios] = await Promise.all([
    getBarbeirosAtivos(empresa.id),
    getBarbeirosVitrine(empresa.id),
    getClienteAtual(),
    getPerfilAtual(),
    getBarbeariaConfig(empresa.id),
    getServicos(empresa.id),
    getProdutos(empresa.id),
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
      produtos={produtos}
      horarios={horarios}
      statusAbertura={getStatusAbertura(horarios)}
    />
  )
}
