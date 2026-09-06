import { getContaManutencaoOuRedirect } from "@/lib/auth"
import { ManutencaoNav } from "@/components/manutencao-nav"
import { SessaoManutencaoTempoReal } from "@/components/manutencao/sessao-manutencao-tempo-real"

export const dynamic = "force-dynamic"

export default async function ManutencaoLayout({ children }: { children: React.ReactNode }) {
  const user = await getContaManutencaoOuRedirect()

  return (
    <div className="min-h-screen bg-background">
      <SessaoManutencaoTempoReal email={user.email ?? ""} />
      <ManutencaoNav email={user.email ?? ""} />
      <main id="conteudo" tabIndex={-1} className="md:pl-60">
        <div className="mx-auto max-w-5xl px-4 py-6 md:px-10 md:py-10">{children}</div>
      </main>
    </div>
  )
}
