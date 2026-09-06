import { KairosLanding } from "@/components/kairos-landing"

// No deploy de demo, a landing de vendas aparece normal (como no práxis):
// o visitante entra pela home, clica em "Entrar" e só lá encontra as
// contas de demonstração, que levam pra barbearia fake.
export default function Home() {
  return <KairosLanding />
}
