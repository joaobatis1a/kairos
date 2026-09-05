import { Reveal, Eyebrow } from "@/components/landing/reveal"

/**
 * Os 6 itens não são uma sequência (não tem "primeiro isso, depois
 * aquilo"), então numerá-los como passo 01-06 — como a versão anterior
 * fazia — era só decoração sem significado. O que organiza esses itens de
 * verdade é quem sente o efeito: o cliente que agenda, ou você que
 * administra. Duas colunas com essa divisão, sem ícone nem grade de card.
 */
const GRUPOS = [
  {
    titulo: "O que o cliente sente",
    itens: [
      { titulo: "Link próprio", texto: "Endereço exclusivo da barbearia, pronto pra colar na bio do Instagram." },
      { titulo: "Avisos automáticos", texto: "Confirmação, lembrete na véspera e agradecimento saem sem ninguém lembrar." },
      { titulo: "Avaliação após o corte", texto: "O cliente avalia o serviço e o profissional; a média fica no seu painel." },
    ],
  },
  {
    titulo: "O que você controla",
    itens: [
      { titulo: "Horários sob controle", texto: "Você define dias de funcionamento, intervalos e a duração de cada serviço." },
      { titulo: "Equipe organizada", texto: "Cadastre barbeiros, ative e desative quem está atendendo na semana." },
      { titulo: "Cada um no seu lugar", texto: "Dono vê tudo, barbeiro vê a própria agenda. Sem dado trocado entre barbearias." },
    ],
  },
]

export function RecursosSection() {
  return (
    <section id="recursos" className="mx-auto max-w-4xl scroll-mt-20 px-6 py-28 md:py-36">
      <Reveal>
        <Eyebrow>Também vem junto</Eyebrow>
      </Reveal>
      <Reveal delay={0.08}>
        <h2 className="mt-5 font-serif text-[clamp(1.75rem,3.6vw,2.75rem)] font-medium leading-tight tracking-[-0.02em]">
          O resto que faz falta<span className="texto-dourado">.</span>
        </h2>
      </Reveal>

      <div className="mt-14 grid grid-cols-1 gap-x-12 gap-y-12 md:grid-cols-2">
        {GRUPOS.map((grupo, gi) => (
          <Reveal key={grupo.titulo} delay={0.1 + gi * 0.1}>
            <h3 className="texto-dourado text-xs font-bold tracking-[0.18em] uppercase">{grupo.titulo}</h3>
            <div className="mt-5 flex flex-col gap-5 border-t border-border/60 pt-5">
              {grupo.itens.map((item) => (
                <div key={item.titulo}>
                  <h4 className="font-serif text-base">{item.titulo}</h4>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{item.texto}</p>
                </div>
              ))}
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
