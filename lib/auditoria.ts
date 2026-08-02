import { createAdminClient } from "@/lib/supabase/admin"

/**
 * Registra uma ação sensível no log de auditoria da empresa. Chamado
 * diretamente pelas server actions (não por trigger de banco — ver
 * lib/supabase/migration_03_audit_log.sql pro motivo).
 */
export async function registrarAuditoria(
  companyId: string,
  atorNome: string,
  acao: string,
  detalhes = "",
) {
  const admin = createAdminClient()
  await admin.from("audit_log").insert({ company_id: companyId, ator_nome: atorNome, acao, detalhes })
}

export type EntradaAuditoria = {
  id: string
  ator_nome: string
  acao: string
  detalhes: string
  created_at: string
}

export async function listarAuditoria(companyId: string): Promise<EntradaAuditoria[]> {
  const admin = createAdminClient()
  const { data } = await admin
    .from("audit_log")
    .select("id, ator_nome, acao, detalhes, created_at")
    .eq("company_id", companyId)
    .order("created_at", { ascending: false })
    .limit(100)
  return data ?? []
}
