// ============================================================
// Configuração central da Barbearia
// Edite este arquivo para personalizar os dados do seu negócio.
// ============================================================

export type Servico = {
  id: string
  nome: string
  descricao: string
  preco: number
  duracaoMin: number
}

export const barbearia = {
  nome: "Navalha de Ouro",
  slogan: "Tradição e estilo em cada corte",
  descricao:
    "Há mais de 10 anos cuidando do visual masculino com técnica, navalha e bom atendimento. Ambiente acolhedor, profissionais experientes e aquele café por conta da casa.",
  telefone: "(11) 95555-0123",
  // WhatsApp no formato internacional, apenas números (para link wa.me)
  whatsapp: "5511955550123",
  endereco: "Rua das Tesouras, 123 - Centro, São Paulo - SP",
  // Link do Google Maps para o botão "Como chegar"
  mapsUrl: "https://maps.google.com/?q=Rua+das+Tesouras+123+Centro+Sao+Paulo",
  instagram: "@navalhadeouro",
  instagramUrl: "https://instagram.com",
  // Horário de funcionamento exibido no rodapé
  funcionamento: [
    { dia: "Segunda a Sexta", horas: "09:00 - 20:00" },
    { dia: "Sábado", horas: "09:00 - 18:00" },
    { dia: "Domingo", horas: "Fechado" },
  ],
}

// Dias da semana abertos (0 = domingo, 1 = segunda ... 6 = sábado)
export const diasAbertos = [1, 2, 3, 4, 5, 6]

// Horários disponíveis para agendamento (intervalos de 30/60 min)
export const horariosDisponiveis = [
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
  "18:00",
  "18:30",
  "19:00",
  "19:30",
]

export const servicos: Servico[] = [
  {
    id: "corte",
    nome: "Corte de Cabelo",
    descricao: "Corte na tesoura ou máquina, finalizado com toalha quente.",
    preco: 45,
    duracaoMin: 40,
  },
  {
    id: "barba",
    nome: "Barba na Navalha",
    descricao: "Toalha quente, navalha e produtos premium para uma barba impecável.",
    preco: 35,
    duracaoMin: 30,
  },
  {
    id: "corte-barba",
    nome: "Corte + Barba",
    descricao: "O combo completo: corte de cabelo e barba na navalha.",
    preco: 70,
    duracaoMin: 60,
  },
  {
    id: "pezinho",
    nome: "Pezinho / Acabamento",
    descricao: "Acabamento na nuca e contornos para manter o visual em dia.",
    preco: 20,
    duracaoMin: 15,
  },
  {
    id: "sobrancelha",
    nome: "Sobrancelha",
    descricao: "Design de sobrancelha masculina na navalha ou pinça.",
    preco: 15,
    duracaoMin: 15,
  },
]

export function formatarPreco(valor: number) {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  })
}
