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

      // Verifica se já existe um owner
      const { count: ownerCount } = await admin
        .from("profiles")
        .select("id", { count: "exact", head: true })
        .eq("role", "owner")

      const primeiroUsuario = (ownerCount ?? 0) === 0

      // Verifica se já tem perfil de equipe
      const { data: perfilEquipe } = await admin
        .from("profiles")
        .select("id, role")
        .eq("id", data.user.id)
        .single()

      if (primeiroUsuario && !perfilEquipe) {
        // Primeiro usuário do sistema → promove para owner
        const nome =
          data.user.user_metadata?.full_name ||
          data.user.user_metadata?.name ||
          data.user.email?.split("@")[0] ||
          "Administrador"

        await admin.from("profiles").insert({
          id: data.user.id,
          nome,
          role: "owner",
          ativo: true,
        })

        return NextResponse.redirect(`${origin}/painel`)
      }

      // Já é equipe → painel
      if (perfilEquipe) {
        return NextResponse.redirect(`${origin}/painel`)
      }

      // Cliente normal
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  return NextResponse.redirect(`${origin}/auth/error`)
}
