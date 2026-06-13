import { getPerfilOuRedirect } from "@/lib/auth"
import { PainelNav } from "@/components/painel/painel-nav"

export default async function PainelLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const perfil = await getPerfilOuRedirect()

  return (
    <div className="flex min-h-screen flex-col">
      <PainelNav perfil={perfil} />
      <main className="flex-1 container mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  )
}