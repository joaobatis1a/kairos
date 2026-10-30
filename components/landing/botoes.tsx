import { ArrowUpRight } from "lucide-react"
import { LINK_CONTATO } from "@/components/landing/contato"
import { Magnetico } from "@/components/landing/magnetico"
import { cn } from "@/lib/utils"

/** Ação principal: pílula em folha de ouro, com o brilho correndo no hover. */
export function BotaoOuro({
  children,
  href = LINK_CONTATO,
  className,
  grande,
}: {
  children: React.ReactNode
  href?: string
  className?: string
  grande?: boolean
}) {
  const externo = href.startsWith("http")
  return (
    <Magnetico forca={0.22}>
      <a
        href={href}
        {...(externo ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        className={cn(
          "fundo-ouro group inline-flex items-center gap-3 rounded-full font-medium tracking-wide shadow-[0_18px_50px_-18px_rgb(212_170_85/0.7)]",
          grande ? "py-2.5 pl-8 pr-2.5 text-base md:text-lg" : "py-2 pl-6 pr-2 text-sm",
          className,
        )}
      >
        {children}
        <span
          className={cn(
            "grid place-items-center rounded-full bg-[#0b0a09] text-[#d4aa55] transition-transform duration-300 group-hover:rotate-45",
            grande ? "h-11 w-11" : "h-9 w-9",
          )}
        >
          <ArrowUpRight className="h-4 w-4" />
        </span>
      </a>
    </Magnetico>
  )
}

/** Ação secundária: texto com fio de ouro que cresce no hover. */
export function BotaoLinha({ children, href, className }: { children: React.ReactNode; href: string; className?: string }) {
  return (
    <a
      href={href}
      className={cn(
        "group relative inline-flex items-center gap-2 py-2 text-sm tracking-wide text-foreground/80 transition-colors hover:text-foreground",
        className,
      )}
    >
      {children}
      <span aria-hidden className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-[0.35] bg-primary transition-transform duration-500 group-hover:scale-x-100" />
    </a>
  )
}
