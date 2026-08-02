/**
 * Só o texto que a própria barbearia escreveu. A versão anterior tinha
 * manchete fixa, foto de banco de imagens e uma lista de qualidades
 * ("produtos premium", "ambiente higienizado") afirmadas no código pra
 * toda empresa cliente — o sistema não tem como saber se é verdade.
 */
export function StorefrontSobre({ descricao }: { descricao: string }) {
  if (!descricao.trim()) return null

  return (
    <section id="sobre" className="mx-auto max-w-3xl scroll-mt-24 px-6 py-20 md:py-24">
      <h2 className="font-serif text-[clamp(1.75rem,4vw,2.5rem)] font-semibold tracking-[-0.02em]">
        Sobre a casa
      </h2>
      <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{descricao}</p>
    </section>
  )
}
