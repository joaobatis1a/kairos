import { listarContasManutencao } from "@/app/actions/manutencao"
import { getContaManutencaoOuRedirect } from "@/lib/auth"
import { EquipeManutencaoView } from "@/components/manutencao/equipe-manutencao-view"

export const dynamic = "force-dynamic"

export default async function EquipeManutencaoPage() {
  const [contas, user] = await Promise.all([listarContasManutencao(), getContaManutencaoOuRedirect()])
  return <EquipeManutencaoView contasIniciais={contas} emailAtual={user.email ?? ""} />
}
