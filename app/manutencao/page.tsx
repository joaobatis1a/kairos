import { listarEmpresas } from "@/app/actions/manutencao"
import { ManutencaoView } from "@/components/manutencao/manutencao-view"

export const dynamic = "force-dynamic"

export default async function ManutencaoPage() {
  const empresas = await listarEmpresas()
  return <ManutencaoView empresasIniciais={empresas} />
}
