import type { MetadataRoute } from "next"
import { createClient } from "@/lib/supabase/server"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"

  const supabase = await createClient()
  // companies tem policy pública só pras ativas
  const { data: empresas } = await supabase
    .from("companies")
    .select("slug, updated_at")
    .eq("status", "ativo")

  const storefronts = (empresas ?? []).map((e) => ({
    url: `${base}/b/${e.slug}`,
    lastModified: e.updated_at ? new Date(e.updated_at) : undefined,
  }))

  return [
    { url: base, lastModified: new Date() },
    { url: `${base}/termos` },
    { url: `${base}/privacidade` },
    ...storefronts,
  ]
}
