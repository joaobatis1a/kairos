import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl
  const code = searchParams.get("code")
  const next = searchParams.get("next") ?? "/"

  if (code) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error && data.user) {
      const admin = createAdminClient()

      // Já é equipe (owner/barbeiro de alguma empresa) → painel. Uma conta
      // Google só vira equipe através de convite (ver app/auth/callback/route.ts);
      // esse callback é o do /conta e nunca promove ninguém a owner sozinho.
      const { data: perfilEquipe } = await admin
        .from("profiles")
        .select("id, role")
        .eq("id", data.user.id)
        .single()

      if (perfilEquipe) {
        return NextResponse.redirect(`${origin}/painel`)
      }

      // Cliente normal — garante registro na tabela clientes
      const nome =
        data.user.user_metadata?.full_name ||
        data.user.user_metadata?.name ||
        data.user.email?.split("@")[0] ||
        "Cliente"

      const { data: clienteExistente } = await admin
        .from("clientes")
        .select("id")
        .eq("id", data.user.id)
        .single()

      if (!clienteExistente) {
        await admin.from("clientes").insert({
          id: data.user.id,
          nome,
          email: data.user.email ?? "",
          whatsapp: data.user.user_metadata?.whatsapp ?? "",
        })
      }

      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  return NextResponse.redirect(`${origin}/auth/error`)
}
