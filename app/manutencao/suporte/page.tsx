import { listarChamadosAdmin } from "@/app/actions/suporte"
import { SuporteManutencaoView } from "@/components/manutencao/suporte-manutencao-view"

export const dynamic = "force-dynamic"

export default async function SuporteManutencaoPage() {
  const chamados = await listarChamadosAdmin()
  return <SuporteManutencaoView chamadosIniciais={chamados} />
}
