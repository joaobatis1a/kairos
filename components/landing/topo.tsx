import { KairosMark } from "@/components/kairos-mark"
import { LINK_CONTATO } from "@/components/landing/contato"

const MENU = [
  { href: "#como-funciona", rotulo: "Como funciona" },
  { href: "#recursos", rotulo: "Recursos" },
  { href: "#perguntas", rotulo: "Perguntas" },
]

function BotaoContato({ children, pequeno }: { children: React.ReactNode; pequeno?: boolean }) {
  return (
    <a
      href={LINK_CONTATO}
      target="_blank"
      rel="noopener noreferrer"
      className={
        "inline-block whitespace-nowrap rounded bg-primary font-semibold text-primary-foreground transition-opacity hover:opacity-90 " +
        (pequeno ? "px-4 py-2.5 text-sm" : "px-6 py-3.5 text-[15px]")
      }
    >
      {children}
    </a>
  )
}

/**
 * Topo da landing (opção "Manchete", escolhida pelo dono): só a frase,
 * enorme, e uma linha embaixo com o texto de apoio e o botão.
 */
export function Topo() {
  return (
    <section id="topo" className="relative isolate flex min-h-[100svh] flex-col overflow-hidden">
      {/* o brilho quente no alto, à direita */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_55%_at_72%_18%,rgb(184_137_59/0.14),transparent_70%)]"
      />

      <header className="mx-auto flex w-full max-w-[90rem] items-center justify-between gap-6 px-5 py-5 md:px-10 md:py-6">
        <a href="#topo" className="flex items-center gap-2.5" aria-label="kairos, início">
          <KairosMark className="h-8 w-8 text-primary md:h-9 md:w-9" />
          <span className="font-display text-[22px] font-extrabold uppercase tracking-[0.08em]">Kairos</span>
        </a>
        <nav aria-label="Principal" className="hidden gap-7 text-sm text-foreground/60 md:flex">
          {MENU.map((m) => (
            <a key={m.href} href={m.href} className="transition-colors hover:text-foreground">
              {m.rotulo}
            </a>
          ))}
        </nav>
        <BotaoContato pequeno>Quero o kairos</BotaoContato>
      </header>

      <div className="mx-auto flex w-full max-w-[90rem] flex-1 flex-col justify-end px-5 pb-10 md:px-10 md:pb-12">
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-primary">
          Sistema de agendamento para barbearias
        </p>
        <h1 className="mt-4 font-display text-[clamp(4rem,11.5vw,9.5rem)] font-extrabold uppercase leading-[0.9] md:mt-5">
          A hora certa
          <br />
          de cada <span className="text-primary">cadeira.</span>
        </h1>
        <div className="mt-8 flex flex-col items-start justify-between gap-6 border-t border-border pt-6 md:mt-10 md:flex-row md:items-end md:gap-8">
          <p className="max-w-md text-lg leading-relaxed text-foreground/65">
            O cliente marca pelo link da sua barbearia. A equipe vê o dia inteiro e você fecha o mês sem caderno.
          </p>
          <BotaoContato>Quero o kairos na minha barbearia</BotaoContato>
        </div>
      </div>
    </section>
  )
}
