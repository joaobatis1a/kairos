export type Role = "owner" | "barber"

export type StatusAgendamento = "pendente" | "confirmado" | "cancelado"

export type Profile = {
  id: string
  nome: string
  role: Role
  ativo: boolean
  created_at: string
}

export type Agendamento = {
  id: string
  cliente_nome: string
  cliente_whatsapp: string
  servico_id: string
  servico_nome: string
  servico_preco: number
  barbeiro_id: string | null
  data: string // YYYY-MM-DD
  horario: string // HH:MM:SS
  status: StatusAgendamento
  observacoes: string | null
  created_at: string
}

// Agendamento com dados do barbeiro embutidos (join)
export type AgendamentoComBarbeiro = Agendamento & {
  barbeiro?: Pick<Profile, "id" | "nome"> | null
}
