import { getPerfilOuRedirect } from "@/lib/auth"
import { listarAgendamentos } from "@/app/actions/painel"
import { redirect } from "next/navigation"
import { AgendamentosView } from "@/components/painel/agendamentos-view"

export const dynamic = "force-dynamic"

export default async function AgendamentosPage() {
  const perfil = await getPerfilOuRedirect()
  if (perfil.role !== "owner") redirect("/painel")

  const agendamentos = await listarAgendamentos()
  return <AgendamentosView agendamentos={agendamentos} />
}
