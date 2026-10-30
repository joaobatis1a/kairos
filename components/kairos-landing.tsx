import { Topo } from "@/components/landing/topo"

/**
 * Landing montada seção por seção, cada uma escolhida pelo dono entre
 * opções. Por enquanto só o topo está decidido.
 */
export function KairosLanding() {
  return (
    <div className="kairos-noite relative min-h-screen font-sans">
      <div className="grao" aria-hidden />
      <main id="conteudo" tabIndex={-1}>
        <Topo />
      </main>
    </div>
  )
}
