import { NextResponse } from "next/server"
import { getEmpresaPorSlug, getBarbeariaConfig } from "@/app/actions/config"

// Manifest por barbearia: cada cliente instala "o app da barbearia dele"
// (nome e logo da empresa), não um "kairos" genérico. Ver manifest.ts
// (app raiz) pra o manifest default do painel/conta.
export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const empresa = await getEmpresaPorSlug(slug)
  if (!empresa) return NextResponse.json({ error: "not found" }, { status: 404 })

  const config = await getBarbeariaConfig(empresa.id)
  const nome = config.nome || "Minha Barbearia"

  const icons = config.logo_url
    ? [
        { src: config.logo_url, sizes: "512x512", type: tipoDaImagem(config.logo_url), purpose: "any" },
      ]
    : [
        { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
        { src: "/pwa-icon", sizes: "512x512", type: "image/png", purpose: "any" },
        { src: "/pwa-icon-maskable", sizes: "512x512", type: "image/png", purpose: "maskable" },
      ]

  return NextResponse.json(
    {
      name: nome,
      short_name: nome.length > 20 ? nome.slice(0, 20) : nome,
      description: config.slogan?.trim() || `Agende seu horário na ${nome}.`,
      start_url: `/b/${slug}`,
      scope: `/b/${slug}`,
      display: "standalone",
      background_color: "#0a0a0a",
      theme_color: "#0a0a0a",
      icons,
    },
    { headers: { "Content-Type": "application/manifest+json" } },
  )
}

function tipoDaImagem(url: string): string {
  const ext = url.split("?")[0].split(".").pop()?.toLowerCase()
  if (ext === "jpg" || ext === "jpeg") return "image/jpeg"
  if (ext === "webp") return "image/webp"
  if (ext === "svg") return "image/svg+xml"
  return "image/png"
}
