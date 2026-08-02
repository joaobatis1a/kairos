import { getClienteOuRedirect } from "@/lib/auth"
import { getResumoCliente } from "@/app/actions/perfil-cliente"
import { ContaNav } from "@/components/conta/conta-nav"

export const dynamic = "force-dynamic"

// Casca das páginas internas da conta: barra fina (seta + título) e o
// conteúdo abaixo. O checklist de seções vive só no chip do storefront.
export default async function ContaAreaLayout({ children }: { children: React.ReactNode }) {
  // getClienteOuRedirect só serve de guarda de autenticação aqui — o valor
  // em si não é mais exibido nesta casca, cada página busca o que precisa
  await getClienteOuRedirect()
  const resumo = await getResumoCliente()
  const barbearia = resumo.barbearias[0] ?? null

  return (
    <div className="min-h-svh bg-background">
      <ContaNav barbearia={barbearia} />
      <main id="conteudo" tabIndex={-1} className="mx-auto max-w-4xl px-4 py-8 md:px-6">
        {children}
      </main>
    </div>
  )
}
