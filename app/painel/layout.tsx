import { getPerfilOuRedirect } from "@/lib/auth"
import { PainelNav } from "@/components/painel/painel-nav"
import { getBarbeariaConfig } from "@/app/actions/config"

export const dynamic = "force-dynamic"

export default async function PainelLayout({ children }: { children: React.ReactNode }) {
  const [perfil, config] = await Promise.all([getPerfilOuRedirect(), getBarbeariaConfig()])

  return (
    <div className="min-h-screen bg-background">
      <PainelNav perfil={perfil} nomeNegocio={config.nome} />
      <main className="mx-auto max-w-6xl px-4 py-6 md:pl-[17rem]">{children}</main>
    </div>
  )
}
