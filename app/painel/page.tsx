import { getPerfilOuRedirect } from "@/lib/auth"
import { getDashboardOwner } from "@/app/actions/dashboard"
import { DashboardView } from "@/components/dashboard-view"
import { redirect } from "next/navigation"

export const dynamic = "force-dynamic"

export default async function PainelHome() {
  const perfil = await getPerfilOuRedirect()

  if (perfil.role !== "owner") {
    redirect("/painel/agenda")
  }

  const dados = await getDashboardOwner()

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-serif text-3xl font-bold">
          Olá, {perfil.nome?.split(" ")[0] || "bem-vindo"}
        </h1>
        <p className="text-muted-foreground">Visão geral do seu negócio.</p>
      </div>

      {dados ? (
        <DashboardView dados={dados} />
      ) : (
        <p className="text-muted-foreground">Não foi possível carregar o dashboard.</p>
      )}
    </div>
  )
}
