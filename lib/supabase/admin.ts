import { createClient as createSupabaseClient } from "@supabase/supabase-js"

/**
 * Client administrativo (service role). USAR SOMENTE no servidor.
 * Ignora RLS — necessário para o dono criar contas de barbeiros.
 */
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  )
}
