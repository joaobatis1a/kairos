"use client"

import { useEffect, useRef } from "react"

type Particula = { x: number; y: number; r: number; vy: number; vx: number; a: number; fase: number }

/**
 * Fundo do hero: um facho de luz dourada difusa vindo do alto e poeira de
 * ouro subindo devagar, como num salão com a luz da tarde. Canvas puro,
 * sem imagem. Segue o cursor com atraso (a luz "acompanha"), pausa fora da
 * tela e, com movimento reduzido, desenha um único quadro parado.
 */
export function FundoOuro() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const reduzido = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    let largura = 0
    let altura = 0
    let particulas: Particula[] = []
    let visivel = true
    let raf = 0
    let alvoX = 0.62
    let luzX = 0.62

    const criar = (): Particula => ({
      x: Math.random() * largura,
      y: Math.random() * altura,
      r: 0.5 + Math.random() * 1.6,
      vy: 0.12 + Math.random() * 0.3,
      vx: (Math.random() - 0.5) * 0.12,
      a: 0.15 + Math.random() * 0.55,
      fase: Math.random() * Math.PI * 2,
    })

    const medir = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      largura = canvas.clientWidth
      altura = canvas.clientHeight
      canvas.width = Math.round(largura * dpr)
      canvas.height = Math.round(altura * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const total = Math.round(Math.min(90, (largura * altura) / 14000))
      particulas = Array.from({ length: total }, criar)
    }

    const desenhar = (t: number) => {
      ctx.clearRect(0, 0, largura, altura)

      // facho: gradiente cônico fake com dois elipses empilhados
      luzX += (alvoX - luzX) * 0.04
      const cx = largura * luzX
      const respira = reduzido ? 1 : 0.92 + Math.sin(t / 2600) * 0.08
      const grande = ctx.createRadialGradient(cx, -altura * 0.1, 0, cx, -altura * 0.1, altura * 1.15)
      grande.addColorStop(0, `rgba(201,162,75,${0.34 * respira})`)
      grande.addColorStop(0.45, `rgba(201,162,75,${0.1 * respira})`)
      grande.addColorStop(1, "rgba(201,162,75,0)")
      ctx.fillStyle = grande
      ctx.fillRect(0, 0, largura, altura)

      const brasa = ctx.createRadialGradient(largura * 0.12, altura * 0.95, 0, largura * 0.12, altura * 0.95, altura * 0.6)
      brasa.addColorStop(0, `rgba(176,120,48,${0.16 * respira})`)
      brasa.addColorStop(1, "rgba(176,120,48,0)")
      ctx.fillStyle = brasa
      ctx.fillRect(0, 0, largura, altura)

      for (const p of particulas) {
        if (!reduzido) {
          p.y -= p.vy
          p.x += p.vx + Math.sin(t / 1800 + p.fase) * 0.08
          if (p.y < -4) {
            p.y = altura + 4
            p.x = Math.random() * largura
          }
        }
        // acende mais perto do facho
        const dist = Math.abs(p.x - cx) / largura
        const brilho = p.a * (0.35 + Math.max(0, 1 - dist * 1.8) * 0.9)
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(232,204,134,${Math.min(brilho, 0.9).toFixed(3)})`
        ctx.fill()
      }
    }

    const laco = (t: number) => {
      if (visivel) desenhar(t)
      raf = requestAnimationFrame(laco)
    }

    const aoMover = (e: PointerEvent) => {
      alvoX = 0.35 + (e.clientX / window.innerWidth) * 0.5
    }

    medir()
    if (reduzido) {
      desenhar(0)
    } else {
      raf = requestAnimationFrame(laco)
    }

    const observador = new IntersectionObserver(([e]) => {
      visivel = e.isIntersecting
    })
    observador.observe(canvas)
    const redim = new ResizeObserver(() => {
      medir()
      if (reduzido) desenhar(0)
    })
    redim.observe(canvas)
    window.addEventListener("pointermove", aoMover, { passive: true })

    return () => {
      cancelAnimationFrame(raf)
      observador.disconnect()
      redim.disconnect()
      window.removeEventListener("pointermove", aoMover)
    }
  }, [])

  return <canvas ref={canvasRef} aria-hidden className="absolute inset-0 h-full w-full" />
}
