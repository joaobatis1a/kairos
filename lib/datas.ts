import { diasAbertos } from "@/config/barbearia"

// Gera os próximos N dias disponíveis (respeitando diasAbertos)
export function getDiasDisponiveis(quantidade = 14): { value: string; label: string; diaSemana: string }[] {
  const dias: { value: string; label: string; diaSemana: string }[] = []
  const nomesDias = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]
  const nomesMes = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"]

  const hoje = new Date()
  hoje.setHours(0, 0, 0, 0)

  let offset = 0
  while (dias.length < quantidade && offset < 60) {
    const d = new Date(hoje)
    d.setDate(hoje.getDate() + offset)
    offset++

    if (!diasAbertos.includes(d.getDay())) continue

    const yyyy = d.getFullYear()
    const mm = String(d.getMonth() + 1).padStart(2, "0")
    const dd = String(d.getDate()).padStart(2, "0")

    dias.push({
      value: `${yyyy}-${mm}-${dd}`,
      label: `${dd} ${nomesMes[d.getMonth()]}`,
      diaSemana: nomesDias[d.getDay()],
    })
  }

  return dias
}

export function formatarDataExtenso(dataIso: string): string {
  const [y, m, d] = dataIso.split("-").map(Number)
  const date = new Date(y, m - 1, d)
  return date.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
  })
}

export function formatarDataCurta(dataIso: string): string {
  const [y, m, d] = dataIso.split("-").map(Number)
  return `${String(d).padStart(2, "0")}/${String(m).padStart(2, "0")}/${y}`
}
