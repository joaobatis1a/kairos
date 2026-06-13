import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import type { Profile } from "@/lib/types"

export async function getPerfilOuRedirect(): Promise<Profile> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  console.log("[auth] user:", user?.id ?? "null")

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  console.log("[auth] profile:", profile)
  console.log("[auth] error:", error)

  if (!profile) {
    redirect("/auth/login")
  }

  return profile as Profile
}