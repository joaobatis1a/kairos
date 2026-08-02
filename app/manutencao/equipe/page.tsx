import { listarContasManutencao } from "@/app/actions/manutencao"
import { EquipeManutencaoView } from "@/components/manutencao/equipe-manutencao-view"

export const dynamic = "force-dynamic"

export default async function EquipeManutencaoPage() {
  const contas = await listarContasManutencao()
  return <EquipeManutencaoView contasIniciais={contas} />
}
