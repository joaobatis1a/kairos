import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          )
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          )
        },
      },
    },
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const path = request.nextUrl.pathname

  // cadastro-equipe fica de fora: é a própria página que recebe o usuário
  // Google-autenticado sem profile ainda (ver app/auth/callback/route.ts).
  // Sem essa exceção, a regra abaixo ("rota /auth com sessão -> /painel")
  // manda de volta pro /painel antes de dar chance de digitar o código de
  // convite, e o /painel sem profile manda de volta pro /auth/login -> loop.
  const isAuthRoute = path.startsWith("/auth") && path !== "/auth/cadastro-equipe"
  const isPainelRoute = path.startsWith("/painel")
  const isManutencaoRoute = path.startsWith("/manutencao")

  const isContaPublicRoute =
    path === "/conta/login" ||
    path === "/conta/cadastro" ||
    path === "/conta/esqueci-senha" ||
    path === "/conta/redefinir-senha" ||
    path.startsWith("/conta/callback")

  const isContaPrivateRoute = path.startsWith("/conta") && !isContaPublicRoute

  if ((isPainelRoute || isManutencaoRoute) && !user) {
    const url = request.nextUrl.clone()
    url.pathname = "/auth/login"
    return NextResponse.redirect(url)
  }

  if (isAuthRoute && user) {
    const url = request.nextUrl.clone()
    url.pathname = "/painel"
    return NextResponse.redirect(url)
  }

  if (isContaPrivateRoute && !user) {
    const url = request.nextUrl.clone()
    url.pathname = "/conta/login"
    url.searchParams.set("next", path)
    return NextResponse.redirect(url)
  }

  if ((path === "/conta/login" || path === "/conta/cadastro") && user) {
  const url = request.nextUrl.clone()
  url.pathname = "/"
  return NextResponse.redirect(url)
  }

  return supabaseResponse
}