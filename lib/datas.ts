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

const NOMES_DIAS_LONGO = ["domingo", "segunda", "terça", "quarta", "quinta", "sexta", "sábado"]

/**
 * Se a barbearia está atendendo agora, a partir da config de dias/horários.
 * Calculado no servidor (a página é dynamic) pra não divergir na hidratação.
 */
export function getStatusAbertura(config: { dias_abertos: number[]; horarios: string[] }): {
  aberto: boolean
  texto: string
} {
  const horarios = [...config.horarios].sort()
  if (horarios.length === 0 || config.dias_abertos.length === 0) {
    return { aberto: false, texto: "Horários a definir" }
  }

  const agora = new Date()
  const minutosAgora = agora.getHours() * 60 + agora.getMinutes()
  const paraMinutos = (h: string) => {
    const [hh, mm] = h.split(":")
    return Number(hh) * 60 + Number(mm)
  }

  const abreHoje = config.dias_abertos.includes(agora.getDay())
  const primeiro = paraMinutos(horarios[0])
  const ultimo = paraMinutos(horarios[horarios.length - 1])

  if (abreHoje && minutosAgora >= primeiro && minutosAgora <= ultimo) {
    return { aberto: true, texto: `Aberto agora · até ${horarios[horarios.length - 1]}` }
  }
  if (abreHoje && minutosAgora < primeiro) {
    return { aberto: false, texto: `Abre hoje às ${horarios[0]}` }
  }

  // procura o próximo dia de funcionamento
  for (let i = 1; i <= 7; i++) {
    const dia = (agora.getDay() + i) % 7
    if (config.dias_abertos.includes(dia)) {
      const quando = i === 1 ? "amanhã" : NOMES_DIAS_LONGO[dia]
      return { aberto: false, texto: `Abre ${quando} às ${horarios[0]}` }
    }
  }
  return { aberto: false, texto: "Fechado" }
}
