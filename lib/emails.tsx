import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

const FROM = process.env.RESEND_FROM ?? "onboarding@resend.dev"
const TO_TEST = process.env.RESEND_TEST_EMAIL ?? "pessoalba1is1a@gmail.com"

// Em modo teste (sem domínio), sempre envia para o email de teste
function resolverDestinatario(emailCliente?: string | null) {
  const temDominio = !FROM.includes("resend.dev")
  return temDominio && emailCliente ? emailCliente : TO_TEST
}

type DadosAgendamento = {
  clienteNome: string
  clienteEmail?: string | null
  servicoNome: string
  servicoPreco: number
  barbeiroNome?: string | null
  data: string // YYYY-MM-DD
  horario: string
  nomeBarbearia: string
}

function formatarData(data: string) {
  const [ano, mes, dia] = data.split("-")
  const meses = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"]
  return `${dia} de ${meses[parseInt(mes) - 1]} de ${ano}`
}

function formatarPreco(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
}

// ── Templates HTML ────────────────────────────────────────────

function layoutBase(conteudo: string, nomeBarbearia: string) {
  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>${nomeBarbearia}</title>
</head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:'Helvetica Neue',Arial,sans-serif;color:#e5e5e5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:40px 16px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#141414;border-radius:12px;border:1px solid #2a2a2a;overflow:hidden;">
        <!-- Header -->
        <tr>
          <td style="background:#141414;border-bottom:1px solid #2a2a2a;padding:24px 32px;text-align:center;">
            <p style="margin:0;font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#a0886a;">✦ Barbearia ✦</p>
            <h1 style="margin:4px 0 0;font-size:24px;font-weight:700;color:#d4b896;letter-spacing:1px;">${nomeBarbearia}</h1>
          </td>
        </tr>
        <!-- Conteúdo -->
        <tr><td style="padding:32px;">${conteudo}</td></tr>
        <!-- Footer -->
        <tr>
          <td style="border-top:1px solid #2a2a2a;padding:20px 32px;text-align:center;">
            <p style="margin:0;font-size:12px;color:#555;">Este é um email automático, não responda.</p>
            <p style="margin:4px 0 0;font-size:12px;color:#555;">${nomeBarbearia} · ${new Date().getFullYear()}</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}

function linhaInfo(label: string, valor: string) {
  return `
  <tr>
    <td style="padding:8px 0;color:#888;font-size:14px;width:40%;">${label}</td>
    <td style="padding:8px 0;color:#e5e5e5;font-size:14px;font-weight:500;">${valor}</td>
  </tr>`
}

// ── Email 1: Confirmação ──────────────────────────────────────

export async function enviarEmailConfirmacao(dados: DadosAgendamento) {
  const conteudo = `
    <h2 style="margin:0 0 8px;font-size:20px;color:#d4b896;">Agendamento confirmado! ✓</h2>
    <p style="margin:0 0 24px;color:#888;font-size:14px;">Olá, <strong style="color:#e5e5e5;">${dados.clienteNome}</strong>! Seu horário está reservado.</p>
    
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#1a1a1a;border-radius:8px;border:1px solid #2a2a2a;padding:16px;margin-bottom:24px;">
      <tbody>
        ${linhaInfo("Serviço", dados.servicoNome)}
        ${linhaInfo("Data", formatarData(dados.data))}
        ${linhaInfo("Horário", dados.horario.slice(0, 5))}
        ${dados.barbeiroNome ? linhaInfo("Profissional", dados.barbeiroNome) : ""}
        ${linhaInfo("Valor", formatarPreco(dados.servicoPreco))}
      </tbody>
    </table>

    <p style="margin:0;font-size:13px;color:#666;text-align:center;">
      Caso precise cancelar ou remarcar, entre em contato com a barbearia.
    </p>
  `
  try {
    await resend.emails.send({
      from: FROM,
      to: resolverDestinatario(dados.clienteEmail),
      subject: `✓ Agendamento confirmado — ${dados.nomeBarbearia}`,
      html: layoutBase(conteudo, dados.nomeBarbearia),
    })
  } catch (e) {
    console.error("[email] Erro ao enviar confirmação:", e)
  }
}

// ── Email 2: Cancelamento ─────────────────────────────────────

export async function enviarEmailCancelamento(
  dados: DadosAgendamento,
  motivo: string,
) {
  const conteudo = `
    <h2 style="margin:0 0 8px;font-size:20px;color:#e05555;">Agendamento cancelado</h2>
    <p style="margin:0 0 24px;color:#888;font-size:14px;">Olá, <strong style="color:#e5e5e5;">${dados.clienteNome}</strong>. Infelizmente seu agendamento foi cancelado.</p>

    <table width="100%" cellpadding="0" cellspacing="0" style="background:#1a1a1a;border-radius:8px;border:1px solid #2a2a2a;padding:16px;margin-bottom:16px;">
      <tbody>
        ${linhaInfo("Serviço", dados.servicoNome)}
        ${linhaInfo("Data", formatarData(dados.data))}
        ${linhaInfo("Horário", dados.horario.slice(0, 5))}
      </tbody>
    </table>

    <div style="background:#2a1515;border:1px solid #5a2020;border-radius:8px;padding:16px;margin-bottom:24px;">
      <p style="margin:0 0 4px;font-size:12px;color:#888;text-transform:uppercase;letter-spacing:1px;">Motivo</p>
      <p style="margin:0;font-size:14px;color:#e5e5e5;">${motivo}</p>
    </div>

    <p style="margin:0;font-size:13px;color:#666;text-align:center;">
      Para remarcar, acesse nosso site ou entre em contato.
    </p>
  `
  try {
    await resend.emails.send({
      from: FROM,
      to: resolverDestinatario(dados.clienteEmail),
      subject: `Agendamento cancelado — ${dados.nomeBarbearia}`,
      html: layoutBase(conteudo, dados.nomeBarbearia),
    })
  } catch (e) {
    console.error("[email] Erro ao enviar cancelamento:", e)
  }
}

// ── Email 3: Lembrete ─────────────────────────────────────────

export async function enviarEmailLembrete(dados: DadosAgendamento) {
  const conteudo = `
    <h2 style="margin:0 0 8px;font-size:20px;color:#d4b896;">Lembrete de agendamento 🕐</h2>
    <p style="margin:0 0 24px;color:#888;font-size:14px;">Olá, <strong style="color:#e5e5e5;">${dados.clienteNome}</strong>! Seu horário é amanhã.</p>

    <table width="100%" cellpadding="0" cellspacing="0" style="background:#1a1a1a;border-radius:8px;border:1px solid #2a2a2a;padding:16px;margin-bottom:24px;">
      <tbody>
        ${linhaInfo("Serviço", dados.servicoNome)}
        ${linhaInfo("Data", formatarData(dados.data))}
        ${linhaInfo("Horário", dados.horario.slice(0, 5))}
        ${dados.barbeiroNome ? linhaInfo("Profissional", dados.barbeiroNome) : ""}
        ${linhaInfo("Valor", formatarPreco(dados.servicoPreco))}
      </tbody>
    </table>

    <p style="margin:0;font-size:13px;color:#666;text-align:center;">
      Te esperamos amanhã! Caso precise cancelar, entre em contato com antecedência.
    </p>
  `
  try {
    await resend.emails.send({
      from: FROM,
      to: resolverDestinatario(dados.clienteEmail),
      subject: `Lembrete: seu horário é amanhã — ${dados.nomeBarbearia}`,
      html: layoutBase(conteudo, dados.nomeBarbearia),
    })
  } catch (e) {
    console.error("[email] Erro ao enviar lembrete:", e)
  }
}
