export type Role = "owner" | "barber"

export type StatusAgendamento = "pendente" | "confirmado" | "cancelado"

export type FormaPagamento = "pix" | "dinheiro" | "debito" | "credito"

export type Profile = {
  id: string
  nome: string
  role: Role
  ativo: boolean
  atende_como_barbeiro: boolean
  created_at: string
}

export type Cliente = {
  id: string
  nome: string
  email: string
  whatsapp: string
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
  forma_pagamento: FormaPagamento | null
  created_at: string
}

export type AgendamentoComBarbeiro = Agendamento & {
  barbeiro?: Pick<Profile, "id" | "nome"> | null
}
