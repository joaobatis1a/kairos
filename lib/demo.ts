/**
 * Modo de demonstração pública (link de portfólio): o visitante navega
 * livre por uma barbearia falsa já populada, mas nenhuma ação de escrita
 * é salva de verdade — evita que alguém crie/edite/apague dado real (ou
 * polua o mesmo dado compartilhado por todo visitante) sem precisar
 * duplicar o banco por sessão.
 *
 * Ativado só setando NEXT_PUBLIC_DEMO_MODE=true num deploy Vercel separado
 * (mesmo repo, apontando pro mesmo Supabase). A produção real nunca seta
 * essa variável, então esse arquivo não muda nada lá.
 */
export const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE === "true"

export const AVISO_DEMO = "Isso é uma demonstração — nada é salvo de verdade aqui."

/** Primeira linha de toda action que escreve algo — mesmo formato de
 * retorno ({ ok: false, error }) que o resto das actions já usa. */
export function bloqueadoNoDemo() {
  return { ok: false as const, error: AVISO_DEMO }
}

/**
 * Credenciais da barbearia de demonstração — de propósito públicas (ficam
 * visíveis na própria tela de login): a conta não tem nada de real pra
 * proteger, já que toda escrita é bloqueada. Só existem no Supabase do
 * deploy de demo.
 */
export const DEMO_OWNER = { email: "dono@demo.kairos.app", senha: "Demo1234!" }
export const DEMO_CLIENTE = { email: "cliente@demo.kairos.app", senha: "Demo1234!" }

/** Slug da barbearia fake usada pra popular o deploy de demo. */
export const DEMO_SLUG = "barbearia-kairos-demo"
