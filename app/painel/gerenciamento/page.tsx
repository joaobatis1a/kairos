import { getPerfilOuRedirect } from "@/lib/auth"
import { redirect } from "next/navigation"
import { getBarbeariaConfig, getServicos, getHorariosConfig } from "@/app/actions/config"
import { listarEquipe } from "@/app/actions/equipe"
import { listarBloqueios } from "@/app/actions/bloqueios"
import { GerenciamentoView } from "@/components/painel/gerenciamento-view"

export const dynamic = "force-dynamic"

export default async function GerenciamentoPage() {
  const perfil = await getPerfilOuRedirect()
  if (perfil.role !== "owner") redirect("/painel")

  const [config, servicos, horarios, equipe, bloqueios] = await Promise.all([
    getBarbeariaConfig(perfil.company_id),
    getServicos(perfil.company_id),
    getHorariosConfig(perfil.company_id),
    listarEquipe(),
    listarBloqueios(),
  ])

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-serif text-3xl font-bold">Gerenciamento</h1>
        <p className="text-muted-foreground">Gerencie as informações da barbearia.</p>
      </div>

      <GerenciamentoView
        atende={perfil.atende_como_barbeiro ?? false}
        config={config}
        servicos={servicos}
        horarios={horarios}
        bloqueios={bloqueios}
        barbeiros={equipe.map((e) => ({ id: e.id, nome: e.nome }))}
      />
    </div>
  )
}
