import { listarConversasSuporte } from "@/app/actions/suporte"
import { SuporteManutencaoView } from "@/components/manutencao/suporte-manutencao-view"

export const dynamic = "force-dynamic"

export default async function SuporteManutencaoPage() {
  const conversas = await listarConversasSuporte()
  return <SuporteManutencaoView conversasIniciais={conversas} />
}
