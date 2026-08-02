import { getPerfilOuRedirect } from "@/lib/auth"
import { getAvaliacoesGerais, getAvaliacoesDoBarbeiro } from "@/app/actions/dashboard"
import { AvaliacoesView } from "@/components/painel/avaliacoes-view"

export const dynamic = "force-dynamic"

export default async function AvaliacoesPage() {
  const perfil = await getPerfilOuRedirect()
  const isOwner = perfil.role === "owner"

  const dados = isOwner ? await getAvaliacoesGerais() : await getAvaliacoesDoBarbeiro()

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-serif text-3xl font-bold">Avaliações</h1>
        <p className="text-muted-foreground">
          {isOwner
            ? "Avaliações de todos os barbeiros e clientes."
            : "Avaliações que você recebeu dos seus atendimentos."}
        </p>
      </div>

      <AvaliacoesView dados={dados} isOwner={isOwner} />
    </div>
  )
}
