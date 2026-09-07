/**
 * O poste de barbeiro — símbolo mais reconhecível do ofício — como cenário
 * ambiente atrás da landing, não como ícone literal. Uma cápsula alta,
 * parcialmente cortada pela borda direita da tela (dá escala sem competir
 * com o texto, que fica todo à esquerda/centro), com listras diagonais
 * fluindo devagar.
 *
 * Só `background-position` animado via CSS (ver .pole-fluxo no
 * globals.css) — nenhum JS, nenhum blur, nenhum mix-blend-mode. É a forma
 * mais barata que existe de animar algo: o navegador só desloca um
 * gradiente que já está pronto, sem recalcular layout nem repintura fora
 * da própria camada. Escondido abaixo de md: a tela já é estreita demais
 * pra sobrar espaço nas bordas sem brigar com o conteúdo.
 */
export function BarberPole() {
  return (
    <div
      aria-hidden
      className="pole-fluxo hidden md:block"
      style={{
        position: "absolute",
        top: 0,
        right: "-6rem",
        width: "16rem",
        height: "100%",
        borderRadius: "999px",
        opacity: 0.09,
        transform: "rotate(-2deg)",
        backgroundImage:
          "repeating-linear-gradient(35deg, var(--primary) 0 16px, transparent 16px 34px, var(--foreground) 34px 36px, transparent 36px 56px)",
        backgroundSize: "160% 220px",
        maskImage: "linear-gradient(to right, transparent, black 45%, black 100%)",
        WebkitMaskImage: "linear-gradient(to right, transparent, black 45%, black 100%)",
      }}
    />
  )
}
