import { LandingPage } from "@/components/landing-page"
import { getBarbeirosAtivos } from "@/app/actions/agendamentos"

export const dynamic = "force-dynamic"

export default async function Home() {
  const barbeiros = await getBarbeirosAtivos()
  return <LandingPage barbeiros={barbeiros} />
}
