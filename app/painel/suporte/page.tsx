import { redirect } from "next/navigation"
import { getPerfilOuRedirect } from "@/lib/auth"
import { getConversaSuporte } from "@/app/actions/suporte"
import { SuporteView } from "@/components/painel/suporte-view"

export const dynamic = "force-dynamic"

export default async function SuportePage() {
  const perfil = await getPerfilOuRedirect()
  if (perfil.role !== "owner") redirect("/painel/agenda")

  const { mensagens } = await getConversaSuporte()

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-serif text-3xl font-bold">Suporte</h1>
        <p className="text-muted-foreground">Fale direto com a equipe do kairos.</p>
      </div>

      <SuporteView mensagensIniciais={mensagens} />
    </div>
  )
}
