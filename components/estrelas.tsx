"use client"

import { useState } from "react"
import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

export function Estrelas({
  valor,
  onChange,
  readonly = false,
  tamanho = "md",
}: {
  valor: number
  onChange?: (v: number) => void
  readonly?: boolean
  tamanho?: "sm" | "md" | "lg"
}) {
  const [hover, setHover] = useState(0)

  const tamanhos = { sm: "h-3.5 w-3.5", md: "h-5 w-5", lg: "h-7 w-7" }

  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <button
          key={i}
          type="button"
          disabled={readonly}
          onClick={() => onChange?.(i)}
          onMouseEnter={() => !readonly && setHover(i)}
          onMouseLeave={() => !readonly && setHover(0)}
          className={cn("transition-colors", readonly ? "cursor-default" : "cursor-pointer")}
        >
          <Star
            className={cn(
              tamanhos[tamanho],
              (hover || valor) >= i ? "fill-primary text-primary" : "fill-muted text-muted-foreground/30",
            )}
          />
        </button>
      ))}
    </div>
  )
}
