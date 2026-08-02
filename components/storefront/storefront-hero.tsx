import { CalendarCheck, MapPin, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"

/**
 * Hero conduzido por tipografia, sem fotografia.
 * A foto de banco de imagens que existia aqui deixava o slogan ilegível e
 * é o mesmo clichê de toda barbearia — o nome da casa composto grande
 * identifica melhor e não depende de a barbearia ter foto profissional.
 *
 * A entrada é feita em CSS (classe .surgir) em vez de framer-motion: o
 * estado base é o visível, então o conteúdo mais importante da página não
 * fica dependente de o JavaScript rodar.
 */
export function StorefrontHero({
  nome,
  slogan,
  endereco,
  statusAbertura,
  onAgendar,
}: {
  nome: string
  slogan: string
  endereco: string
  statusAbertura: { aberto: boolean; texto: string }
  onAgendar: () => void
}) {
  // A seção não usa overflow-hidden de propósito: ele cortava o brilho
  // desfocado exatamente na borda, e o corte aparecia como uma linha
  // horizontal marcando onde o hero termina. O brilho fica limitado a
  // 100vw para não criar rolagem lateral.
  return (
    <section id="top" className="relative px-6 pb-20 pt-32 md:pb-28 md:pt-40">
      <div
        aria-hidden
        className="anim-deriva pointer-events-none absolute left-1/2 top-24 h-[420px] w-[820px] max-w-[100vw] -translate-x-1/2 rounded-full opacity-[0.16] blur-[110px]"
        style={{ background: "radial-gradient(closest-side, var(--primary), transparent)" }}
      />

      <div className="relative mx-auto max-w-4xl text-center">
        {slogan && (
          <p className="surgir texto-dourado text-sm font-semibold">{slogan}</p>
        )}

        <h1 className="surgir mt-4 text-balance font-serif text-[clamp(2.75rem,9vw,5.5rem)] font-semibold leading-[1.05] tracking-[-0.03em]">
          {nome}
        </h1>

        {/* Assinatura: a listra do poste, girando devagar sob o nome */}
        <div
          className="listra-poste listra-poste-animada surgir mx-auto mt-7 h-2.5 w-40 rounded-full"
          aria-hidden
        >
          <div className="listra-poste__padrao" />
        </div>

        <div className="surgir mt-9 flex flex-col items-center gap-5">
          <Button size="lg" onClick={onAgendar} className="cta-dourado h-13 rounded-full px-8 text-base font-bold">
            <CalendarCheck className="h-5 w-5" />
            Agendar meu horário
          </Button>

          {/* Informação prática que tira atrito antes de agendar */}
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              {/* o pulso só existe quando está aberto: é sinal de estado ao
                  vivo, não decoração — fechado fica estático de propósito */}
              <span
                className={`h-2 w-2 rounded-full ${
                  statusAbertura.aberto ? "anim-pulsar bg-emerald-400 text-emerald-400" : "bg-muted-foreground"
                }`}
                aria-hidden
              />
              <span className={statusAbertura.aberto ? "font-semibold text-emerald-400" : ""}>
                {statusAbertura.texto}
              </span>
            </span>
            {endereco && (
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="h-4 w-4" /> {endereco}
              </span>
            )}
            <a
              href="#horarios"
              className="inline-flex items-center gap-1.5 rounded underline-offset-4 hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            >
              <Clock className="h-4 w-4" /> Ver horários
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
