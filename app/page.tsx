import { LandingPage } from "@/components/landing-page"
import { getBarbeirosAtivos } from "@/app/actions/agendamentos"
import { getClienteAtual, getPerfilAtual } from "@/lib/auth"
import { getBarbeariaConfig, getServicos, getHorariosConfig } from "@/app/actions/config"

export const dynamic = "force-dynamic"

export default async function Home() {
  const [barbeiros, cliente, perfil, config, servicos, horarios] = await Promise.all([
    getBarbeirosAtivos(),
    getClienteAtual(),
    getPerfilAtual(),
    getBarbeariaConfig(),
    getServicos(),
    getHorariosConfig(),
  ])

  return (
    <LandingPage
      barbeiros={barbeiros}
      cliente={cliente}
      isEquipe={!!perfil}
      config={config}
      servicos={servicos}
      horarios={horarios}
    />
  )
}
