import { createAdminClient } from "@/lib/supabase/admin"

/**
 * Cria uma notificação in-app. Chamado diretamente pelas server actions que
 * geram o evento (novo agendamento, avaliação, etc.), não por trigger de
 * banco — mesmo padrão do log de auditoria (lib/auditoria.ts).
 *
 * destinatarioId manda pra uma pessoa específica; destinatarioRole manda
 * pra todo mundo com aquele cargo na empresa; os dois omitidos manda pra
 * empresa inteira.
 */
export async function notificar(input: {
  companyId: string
  titulo: string
  corpo?: string
  link?: string
  destinatarioRole?: "owner" | "barber"
  destinatarioId?: string
}) {
  const admin = createAdminClient()
  await admin.from("notifications").insert({
    company_id: input.companyId,
    titulo: input.titulo,
    corpo: input.corpo ?? "",
    link: input.link ?? null,
    destinatario_role: input.destinatarioRole ?? null,
    destinatario_id: input.destinatarioId ?? null,
  })
}
