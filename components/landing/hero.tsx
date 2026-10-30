import { BotaoLinha, BotaoOuro } from "@/components/landing/botoes"
import { Placar } from "@/components/landing/placar"

/**
 * Luminária pendente de latão: fio, cúpula e o facho de luz, tudo no mesmo
 * grupo que balança (então a luz anda junto com a lâmpada).
 */
function Luminaria({ className, atraso = "0s" }: { className?: string; atraso?: string }) {
  return (
    <div aria-hidden className={className}>
      <div className="balanco relative flex flex-col items-center" style={{ animationDelay: atraso }}>
        <span className="h-[18vh] w-px bg-gradient-to-b from-transparent to-[#d4aa55]/60" />
        <svg viewBox="0 0 120 70" className="w-24 md:w-28">
          <defs>
            <linearGradient id="latao" x1="0" x2="1">
              <stop offset="0" stopColor="#6e5420" />
              <stop offset="0.45" stopColor="#e7c878" />
              <stop offset="1" stopColor="#7a5c22" />
            </linearGradient>
          </defs>
          <rect x="54" y="0" width="12" height="10" rx="2" fill="url(#latao)" />
          <path d="M60 8C34 10 14 34 8 62h104C106 34 86 10 60 8z" fill="url(#latao)" />
          <ellipse cx="60" cy="62" rx="52" ry="5" fill="#2a2116" />
          <ellipse cx="60" cy="63" rx="20" ry="4" fill="#fff4d6" />
        </svg>
        {/* facho de luz */}
        <span className="pointer-events-none -mt-2 h-[70vh] w-[46vw] max-w-[44rem] bg-[radial-gradient(ellipse_50%_100%_at_50%_0%,rgb(255_236_190/0.2),rgb(212_170_85/0.06)_55%,transparent_80%)] [clip-path:polygon(44%_0,56%_0,100%_100%,0_100%)]" />
      </div>
    </div>
  )
}

export function Hero() {
  return (
    <section id="topo" className="kairos-noite relative isolate overflow-hidden">
      {/* parede: um brilho quente difuso, como luz batendo no reboco */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_70%_60%_at_70%_30%,rgb(212_170_85/0.1),transparent_70%)]"
      />
      <Luminaria className="pointer-events-none absolute left-[68%] top-0 -z-10 hidden -translate-x-1/2 md:block" />
      <Luminaria className="pointer-events-none absolute left-[22%] top-0 -z-10 hidden -translate-x-1/2 opacity-60 lg:block" atraso="-3s" />

      <div className="mx-auto grid min-h-[100svh] max-w-[90rem] grid-cols-1 items-center gap-14 px-5 pb-16 pt-28 md:px-10 lg:grid-cols-12 lg:gap-10 lg:pt-24">
        <div className="lg:col-span-6">
          <p className="revelar revelar-tarde letreiro flex items-center gap-3 text-[11px] text-[#d4aa55] md:text-xs" style={{ animationDelay: "2s" }}>
            <span className="h-px w-8 bg-[#d4aa55]" />
            Agenda · equipe · caixa
          </p>
          <h1 className="titulo mt-6 text-[clamp(3.2rem,7.4vw,7.2rem)]">
            <span className="block overflow-hidden pb-[0.08em]">
              <span className="revelar-linha revelar-tarde block" style={{ animationDelay: "2.05s" }}>
                A hora certa
              </span>
            </span>
            <span className="block overflow-hidden pb-[0.12em]">
              <span className="revelar-linha revelar-tarde block" style={{ animationDelay: "2.17s" }}>
                de cada <em className="ouro-folha pr-2 italic">cadeira.</em>
              </span>
            </span>
          </h1>
          <p className="revelar revelar-tarde mt-7 max-w-md text-base leading-relaxed text-[#efe6d2]/75 md:text-lg" style={{ animationDelay: "2.4s" }}>
            O sistema de agendamento feito para barbearia. O cliente marca sozinho pelo link da casa, a equipe vê o dia
            inteiro e você fecha o mês sem caderno.
          </p>
          <div className="revelar revelar-tarde mt-9 flex flex-wrap items-center gap-x-8 gap-y-4" style={{ animationDelay: "2.55s" }}>
            <BotaoOuro grande>Quero o kairos na minha barbearia</BotaoOuro>
            <BotaoLinha href="#por-dentro">Ver por dentro</BotaoLinha>
          </div>
          <ul
            className="revelar revelar-tarde mt-12 flex flex-wrap gap-x-6 gap-y-2 text-[11px] uppercase tracking-[0.18em] text-[#efe6d2]/45"
            style={{ animationDelay: "2.7s" }}
          >
            <li>Sem app para o cliente</li>
            <li aria-hidden>·</li>
            <li>Link próprio</li>
            <li aria-hidden>·</li>
            <li>Funciona no celular</li>
          </ul>
        </div>

        <div className="revelar revelar-tarde lg:col-span-6 lg:pl-6" style={{ animationDelay: "2.3s" }}>
          <Placar className="mx-auto max-w-xl lg:max-w-none" />
        </div>
      </div>

      <div className="meandro" aria-hidden />
    </section>
  )
}
