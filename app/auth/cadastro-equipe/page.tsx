import { createClient } from "@/lib/supabase/server"
import { CadastroEquipeForm } from "@/components/cadastro-equipe-form"

export const dynamic = "force-dynamic"

export default async function CadastroEquipePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return <CadastroEquipeForm emailAtual={user?.email ?? null} />
}
