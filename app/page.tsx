import { redirect } from "next/navigation"
import { KairosLanding } from "@/components/kairos-landing"
import { DEMO_MODE, DEMO_SLUG } from "@/lib/demo"

export default function Home() {
  // No deploy de demo (portfólio) não faz sentido mostrar a landing de
  // vendas do produto — o visitante vai direto pra barbearia fake, que é
  // a própria demonstração.
  if (DEMO_MODE) redirect(`/b/${DEMO_SLUG}`)

  return <KairosLanding />
}
