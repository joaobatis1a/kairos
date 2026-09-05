import type { Metadata } from "next"
import Link from "next/link"
import { ScissorMark } from "@/components/scissor-mark"

export const metadata: Metadata = {
  title: "Política de Privacidade",
  description: "Como o kairos trata seus dados pessoais.",
}

export default function PrivacidadePage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <Link href="/" className="mb-8 flex items-center gap-2 text-foreground">
        <ScissorMark className="h-5 w-5 text-primary" />
        <span className="font-serif text-lg font-semibold">kairos</span>
      </Link>

      <article className="flex flex-col gap-4 text-sm leading-relaxed text-muted-foreground">
        <h1 className="font-serif text-3xl font-bold text-foreground">Política de Privacidade</h1>
        <p>Última atualização: setembro de 2026.</p>

        <h2 className="mt-4 text-lg font-semibold text-foreground">1. Quais dados coletamos</h2>
        <p>
          Ao criar uma conta de cliente, coletamos seu nome, e-mail e número de WhatsApp. Ao
          agendar um horário, registramos o serviço escolhido, a data, o horário, o profissional
          e a forma de pagamento informada. As barbearias cadastram dados do próprio negócio e
          da equipe.
        </p>

        <h2 className="mt-4 text-lg font-semibold text-foreground">2. Para que usamos</h2>
        <p>
          Os dados são usados exclusivamente para operar o agendamento: identificar você para a
          barbearia, enviar confirmações e lembretes por e-mail, montar seu histórico de
          atendimentos e permitir que você avalie os serviços. Não vendemos nem compartilhamos
          seus dados com terceiros para fins de publicidade.
        </p>

        <h2 className="mt-4 text-lg font-semibold text-foreground">3. Compartilhamento</h2>
        <p>
          Seus dados de agendamento ficam visíveis para a barbearia em que você agendou. Usamos
          o Supabase (banco de dados e autenticação) e o Resend (envio de e-mails) como
          operadores, que tratam os dados apenas sob nossas instruções.
        </p>

        <h2 className="mt-4 text-lg font-semibold text-foreground">4. Seus direitos (LGPD)</h2>
        <p>
          Você pode acessar, corrigir ou excluir seus dados a qualquer momento. A exclusão da
          conta está disponível em <span className="text-foreground">Conta → Configurações</span>.
          Para outras solicitações, fale com a gente pelo suporte.
        </p>

        <h2 className="mt-4 text-lg font-semibold text-foreground">5. Retenção</h2>
        <p>
          Mantemos seus dados enquanto sua conta existir. Ao excluir a conta, os dados pessoais
          são removidos; registros de agendamento podem ser mantidos de forma anonimizada para
          as barbearias.
        </p>

        <p className="mt-6">
          <Link href="/termos" className="text-primary underline-offset-4 hover:underline">
            Ver os Termos de Uso
          </Link>
        </p>
      </article>
    </div>
  )
}
