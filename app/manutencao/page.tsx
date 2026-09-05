import { listarEmpresas, getMetricasPlataforma } from "@/app/actions/manutencao"
import { ManutencaoView } from "@/components/manutencao/manutencao-view"

export const dynamic = "force-dynamic"

export default async function ManutencaoPage() {
  const [empresas, metricas] = await Promise.all([listarEmpresas(), getMetricasPlataforma()])
  return <ManutencaoView empresasIniciais={empresas} metricas={metricas} />
}
