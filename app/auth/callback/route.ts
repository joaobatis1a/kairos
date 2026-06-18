import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl
  const code = searchParams.get("code")
  const next = searchParams.get("next") ?? "/painel"
  const setupOwner = searchParams.get("setup_owner") === "1"

  if (code) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error && data.user) {
      const admin = createAdminClient()

      // Verifica se já existe um owner no sistema
      const { count: ownerCount } = await admin
        .from("profiles")
        .select("id", { count: "exact", head: true })
        .eq("role", "owner")

      const existeOwner = (ownerCount ?? 0) > 0

      // Verifica se esse usuário já tem perfil
      const { data: perfilExistente } = await admin
        .from("profiles")
        .select("id, role")
        .eq("id", data.user.id)
        .single()

      if (setupOwner && !existeOwner) {
        // Primeiro acesso via Google no setup — promover para owner
        const nome =
          data.user.user_metadata?.full_name ||
          data.user.user_metadata?.name ||
          data.user.email?.split("@")[0] ||
          "Administrador"

        if (perfilExistente) {
          // Atualiza perfil existente para owner
          await admin
            .from("profiles")
            .update({ nome, role: "owner", ativo: true })
            .eq("id", data.user.id)
        } else {
          // Cria perfil novo como owner
          await admin.from("profiles").insert({
            id: data.user.id,
            nome,
            role: "owner",
            ativo: true,
          })
        }

        return NextResponse.redirect(`${origin}/painel`)
      }

      // Login normal — verifica se tem perfil de equipe
      if (perfilExistente) {
        return NextResponse.redirect(`${origin}${next}`)
      }

      // Usuário Google sem perfil e sem setup_owner → erro
      return NextResponse.redirect(
        `${origin}/auth/error?reason=sem_perfil`
      )
    }
  }

  return NextResponse.redirect(`${origin}/auth/error`)
}
