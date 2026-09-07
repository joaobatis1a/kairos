"use client"

import { useReducedMotion } from "framer-motion"

/**
 * O mostrador do kairos: um relógio/bússola de horários por trás da landing
 * inteira. "Kairos" é o momento certo (em grego, diferente de "chronos", o
 * tempo que só passa) — a marca acende alguns horários em dourado, como se
 * fossem agendamentos sendo tomados, enquanto o ponteiro se move devagar
 * demais pra realmente marcar hora, mais sundial do que relógio de parede.
 * Não é uma cópia do grafo do práxis: aqui a metáfora é agenda enchendo,
 * não uma rede de conhecimento — o "cenário" certo pra um sistema de
 * horário de barbearia.
 *
 * Só transform (rotação) e opacity/raio via SMIL nativo — nada de
 * blur/mix-blend-mode num elemento que fica fixo atrás do scroll inteiro,
 * pra não pagar custo de repintura a cada frame em aparelho fraco.
 */

const CENTRO = 100
const RAIO = 92

// Arredondado a 2 casas de propósito: Math.sin/cos de servidor (Node) e do
// navegador podem divergir na última casa decimal entre motores JS
// diferentes — sem arredondar, isso gera erro de hidratação (o React
// descarta e re-renderiza o SVG inteiro ao montar), que pesa exatamente no
// primeiro momento em que a landing carrega.
function arred(n: number) {
  return Math.round(n * 100) / 100
}

function gerarMarcas() {
  const marcas: { x1: number; y1: number; x2: number; y2: number; longa: boolean; indice: number }[] = []
  for (let i = 0; i < 60; i++) {
    const angulo = (i * 6 * Math.PI) / 180
    const longa = i % 5 === 0
    const r2 = RAIO - (longa ? 7 : 3)
    marcas.push({
      x1: arred(CENTRO + RAIO * Math.sin(angulo)),
      y1: arred(CENTRO - RAIO * Math.cos(angulo)),
      x2: arred(CENTRO + r2 * Math.sin(angulo)),
      y2: arred(CENTRO - r2 * Math.cos(angulo)),
      longa,
      indice: i,
    })
  }
  return marcas
}

const MARCAS = gerarMarcas()

// Índices (de 60) dos "horários" que acendem, um de cada vez — como
// agendamentos sendo confirmados ao longo do dia.
const MOMENTOS = [3, 14, 23, 34, 45, 52]

export function KairosDial({ className }: { className?: string }) {
  const reducedMotion = useReducedMotion()

  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden focusable="false">
      <g className="text-primary">
        <circle
          cx={CENTRO}
          cy={CENTRO}
          r={RAIO + 4}
          fill="none"
          stroke="currentColor"
          strokeOpacity={0.1}
          strokeWidth={0.5}
        />

        {MARCAS.map((m) => (
          <line
            key={m.indice}
            x1={m.x1}
            y1={m.y1}
            x2={m.x2}
            y2={m.y2}
            stroke="currentColor"
            strokeOpacity={m.longa ? 0.26 : 0.12}
            strokeWidth={m.longa ? 0.6 : 0.35}
            strokeLinecap="round"
          />
        ))}

        {/* ponteiro devagar demais pra marcar hora de verdade — 3min por volta */}
        <g style={{ transformOrigin: `${CENTRO}px ${CENTRO}px` }}>
          <line
            x1={CENTRO}
            y1={CENTRO}
            x2={CENTRO}
            y2={CENTRO - RAIO * 0.6}
            stroke="currentColor"
            strokeOpacity={0.32}
            strokeWidth={0.8}
            strokeLinecap="round"
          />
          {!reducedMotion && (
            <animateTransform
              attributeName="transform"
              type="rotate"
              from={`0 ${CENTRO} ${CENTRO}`}
              to={`360 ${CENTRO} ${CENTRO}`}
              dur="180s"
              repeatCount="indefinite"
            />
          )}
        </g>

        <circle cx={CENTRO} cy={CENTRO} r={1.4} fill="currentColor" fillOpacity={0.45} />

        {MOMENTOS.map((idx, i) => {
          const angulo = (idx * 6 * Math.PI) / 180
          const raioMomento = RAIO + 9
          const cx = arred(CENTRO + raioMomento * Math.sin(angulo))
          const cy = arred(CENTRO - raioMomento * Math.cos(angulo))
          return (
            <circle key={idx} cx={cx} cy={cy} r={1.6} fill="currentColor">
              {reducedMotion ? (
                <animate attributeName="opacity" values="0.55" dur="1s" />
              ) : (
                <>
                  <animate
                    attributeName="opacity"
                    values="0;0;1;0.9;0"
                    keyTimes="0;0.03;0.1;0.24;0.32"
                    dur="11s"
                    begin={`${i * 1.9}s`}
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="r"
                    values="1.1;1.1;2.4;1.7;1.1"
                    keyTimes="0;0.03;0.1;0.24;0.32"
                    dur="11s"
                    begin={`${i * 1.9}s`}
                    repeatCount="indefinite"
                  />
                </>
              )}
            </circle>
          )
        })}
      </g>
    </svg>
  )
}
