"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Eye, EyeOff } from "lucide-react"
import { cn } from "@/lib/utils"

type Props = React.ComponentProps<"input"> & {
  containerClassName?: string
}

export function PasswordInput({ className, containerClassName, ...props }: Props) {
  const [visivel, setVisivel] = useState(false)

  return (
    <div className={cn("relative", containerClassName)}>
      <Input type={visivel ? "text" : "password"} className={cn("pr-9", className)} {...props} />
      <button
        type="button"
        onClick={() => setVisivel((v) => !v)}
        className="absolute inset-y-0 right-0 flex w-9 items-center justify-center text-muted-foreground hover:text-foreground"
        tabIndex={-1}
        aria-label={visivel ? "Ocultar senha" : "Mostrar senha"}
      >
        {visivel ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  )
}
