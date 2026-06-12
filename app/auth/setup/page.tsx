import { existeOwner } from "@/app/actions/equipe"
import { redirect } from "next/navigation"
import { SetupForm } from "@/components/setup-form"

export const dynamic = "force-dynamic"

export default async function SetupPage() {
  // Se já existe dono, não permite novo setup
  if (await existeOwner()) {
    redirect("/auth/login")
  }
  return <SetupForm />
}
