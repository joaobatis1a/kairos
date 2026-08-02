import { getClienteOuRedirect } from "@/lib/auth"
import { getResumoCliente } from "@/app/actions/perfil-cliente"
import { AgendamentosView } from "@/components/conta/agendamentos-view"

export const dynamic = "force-dynamic"

export default async function AgendamentosPage() {
  const [cliente, resumo] = await Promise.all([getClienteOuRedirect(), getResumoCliente()])
  return (
    <AgendamentosView
      primeiroNome={cliente.nome.trim().split(" ")[0] || "por aqui"}
      resumo={resumo}
    />
  )
}
