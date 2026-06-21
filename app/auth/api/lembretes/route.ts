import { createAdminClient } from "@/lib/supabase/admin"
import { getBarbeariaConfig } from "@/app/actions/config"
import { enviarEmailLembrete } from "@/lib/emails"
import { NextResponse } from "next/server"

// Esta rota é chamada diariamente por um cron (ex: Vercel Cron Jobs)
// Envia lembretes para agendamentos de amanhã
export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization")
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
  }

  const amanha = new Date()
  amanha.setDate(amanha.getDate() + 1)
  const dataAmanha = amanha.toISOString().split("T")[0]

  const admin = createAdminClient()
  const { data: agendamentos } = await admin
    .from("agendamentos")
    .select("cliente_nome, servico_nome, servico_preco, data, horario")
    .eq("data", dataAmanha)
    .in("status", ["pendente", "confirmado"])

  if (!agendamentos?.length) {
    return NextResponse.json({ enviados: 0 })
  }

  const config = await getBarbeariaConfig()

  for (const ag of agendamentos) {
    await enviarEmailLembrete({
      clienteNome: ag.cliente_nome,
      clienteEmail: null,
      servicoNome: ag.servico_nome,
      servicoPreco: Number(ag.servico_preco),
      barbeiroNome: null,
      data: ag.data,
      horario: ag.horario,
      nomeBarbearia: config.nome,
    })
  }

  return NextResponse.json({ enviados: agendamentos.length })
}
