import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { ehContaManutencao } from "@/lib/auth"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl
  const code = searchParams.get("code")
  const next = searchParams.get("next") ?? "/painel"

  if (code) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error && data.user) {
      const admin = createAdminClient()

      const { data: perfilExistente } = await admin
        .from("profiles")
        .select("id")
        .eq("id", data.user.id)
        .single()

      if (perfilExistente) {
        return NextResponse.redirect(`${origin}${next}`)
      }

      // Conta de manutenção não pertence a empresa nenhuma — não pede código
      if (await ehContaManutencao(data.user.email)) {
        return NextResponse.redirect(`${origin}/manutencao`)
      }

      // Conta Google autenticada mas ainda sem empresa — precisa de um código
      // de convite (gerado no /manutencao ou por um owner em /painel/equipe)
      return NextResponse.redirect(`${origin}/auth/cadastro-equipe`)
    }
  }

  return NextResponse.redirect(`${origin}/auth/error`)
}
