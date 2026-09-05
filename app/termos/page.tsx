import type { Metadata } from "next"
import Link from "next/link"
import { ScissorMark } from "@/components/scissor-mark"

export const metadata: Metadata = {
  title: "Termos de Uso",
  description: "Condições de uso da plataforma kairos.",
}

export default function TermosPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <Link href="/" className="mb-8 flex items-center gap-2 text-foreground">
        <ScissorMark className="h-5 w-5 text-primary" />
        <span className="font-serif text-lg font-semibold">kairos</span>
      </Link>

      <article className="flex flex-col gap-4 text-sm leading-relaxed text-muted-foreground">
        <h1 className="font-serif text-3xl font-bold text-foreground">Termos de Uso</h1>
        <p>Última atualização: setembro de 2026.</p>

        <h2 className="mt-4 text-lg font-semibold text-foreground">1. O que é o kairos</h2>
        <p>
          O kairos é uma plataforma que conecta clientes a barbearias para agendamento de
          horários. Não somos parte da relação entre você e a barbearia — cada barbearia é
          responsável pelo serviço prestado, pelos preços e pela sua própria agenda.
        </p>

        <h2 className="mt-4 text-lg font-semibold text-foreground">2. Sua conta</h2>
        <p>
          Você é responsável por manter a confidencialidade da sua senha e por toda atividade
          feita na sua conta. Os dados informados no cadastro devem ser verdadeiros e atuais.
        </p>

        <h2 className="mt-4 text-lg font-semibold text-foreground">3. Agendamentos</h2>
        <p>
          Ao agendar, você se compromete a comparecer no horário marcado. Cancelamentos devem
          respeitar a antecedência definida por cada barbearia. Faltas recorrentes podem levar
          a barbearia a recusar novos agendamentos.
        </p>

        <h2 className="mt-4 text-lg font-semibold text-foreground">4. Uso aceitável</h2>
        <p>
          É proibido usar a plataforma para fins ilícitos, criar agendamentos falsos, ou tentar
          acessar dados de outros usuários ou barbearias.
        </p>

        <h2 className="mt-4 text-lg font-semibold text-foreground">5. Alterações</h2>
        <p>
          Estes termos podem ser atualizados. Mudanças relevantes serão comunicadas na
          plataforma. O uso continuado após uma alteração significa concordância com a nova
          versão.
        </p>

        <p className="mt-6">
          <Link href="/privacidade" className="text-primary underline-offset-4 hover:underline">
            Ver a Política de Privacidade
          </Link>
        </p>
      </article>
    </div>
  )
}
