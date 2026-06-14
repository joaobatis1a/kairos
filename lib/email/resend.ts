import { Resend } from "resend"

export const resend = new Resend(process.env.RESEND_API_KEY)

export const EMAIL_FROM = process.env.RESEND_FROM ?? "Kairos Barbearia <onboarding@resend.dev>"

type EnviarEmailInput = {
  to: string
  subject: string
  html: string
}

export async function enviarEmail({ to, subject, html }: EnviarEmailInput) {
  try {
    const { error } = await resend.emails.send({
      from: EMAIL_FROM,
      to,
      subject,
      html,
    })
    if (error) {
      console.log("[email] erro ao enviar:", error)
      return { ok: false, error: error.message }
    }
    return { ok: true }
  } catch (err) {
    console.log("[email] erro inesperado:", err)
    return { ok: false, error: "Erro inesperado ao enviar e-mail." }
  }
}