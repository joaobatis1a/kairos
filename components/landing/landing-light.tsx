/**
 * "Luz de vitrine": o clima de uma barbearia de verdade — feixes de luz
 * quente atravessando o ambiente e poeira flutuando, como sol entrando
 * pela vitrine no fim de tarde. Nenhum objeto literal (tesoura, poste,
 * relógio): a atmosfera do lugar, que funciona igual em qualquer seção
 * sem repetir um ícone.
 *
 * Só transform + opacity animados (compositor puro) — o blur nos feixes é
 * ESTÁTICO (não muda com o scroll, é filter comum, não backdrop-filter
 * amostrando o que passa atrás), então não paga custo por frame de
 * scroll. Ver landing-background.tsx pro porquê disso importar tanto
 * aqui: esse elemento fica de pé o scroll inteiro.
 */
export function LandingLight() {
  return (
    <div aria-hidden className="hidden md:block">
      <div className="feixe feixe-1" />
      <div className="feixe feixe-2" />
      <div className="feixe feixe-3" />
      <div className="poeira" />
    </div>
  )
}
