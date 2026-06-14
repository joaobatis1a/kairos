import { LandingPage } from "@/components/landing-page"
import { getBarbeirosAtivos } from "@/app/actions/agendamentos"
import { getClienteAtual } from "@/lib/auth"

export const dynamic = "force-dynamic"

export default async function Home() {
  const barbeiros = await getBarbeirosAtivos()
  const cliente = await getClienteAtual()
  return <LandingPage barbeiros={barbeiros} cliente={cliente} />
}
