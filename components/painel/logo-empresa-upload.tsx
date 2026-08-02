"use client"

import { useRef, useState, useTransition } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { enviarLogoEmpresa, removerLogoEmpresa } from "@/app/actions/config"
import { toast } from "sonner"
import { Building2, Upload, Trash2, Loader2 } from "lucide-react"

/**
 * Logo da empresa — mesmo padrão de prévia imediata do FotoPerfil (conta do
 * cliente): a imagem escolhida aparece na hora, antes do upload terminar.
 */
export function LogoEmpresaUpload({ logoUrl }: { logoUrl: string | null }) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [previa, setPrevia] = useState<string | null>(null)
  const [enviando, startEnvio] = useTransition()
  const [removendo, startRemocao] = useTransition()

  const mostrando = previa ?? (logoUrl || null)
  const ocupado = enviando || removendo

  function aoEscolher(e: React.ChangeEvent<HTMLInputElement>) {
    const arquivo = e.target.files?.[0]
    e.target.value = ""
    if (!arquivo) return

    const local = URL.createObjectURL(arquivo)
    setPrevia(local)

    const dados = new FormData()
    dados.set("logo", arquivo)

    startEnvio(async () => {
      const res = await enviarLogoEmpresa(dados)
      URL.revokeObjectURL(local)
      if (!res.ok) {
        setPrevia(null)
        toast.error(res.error ?? "Não foi possível enviar a logo.")
        return
      }
      toast.success("Logo atualizada.")
    })
  }

  function remover() {
    startRemocao(async () => {
      const res = await removerLogoEmpresa()
      if (!res.ok) {
        toast.error(res.error ?? "Não foi possível remover a logo.")
        return
      }
      setPrevia(null)
      toast.success("Logo removida.")
    })
  }

  return (
    <div className="flex items-center gap-4 border-b border-border pb-4">
      <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border bg-muted/40">
        {mostrando ? (
          <Image src={mostrando} alt="" width={64} height={64} className="h-full w-full object-cover" unoptimized />
        ) : (
          <Building2 className="h-6 w-6 text-muted-foreground" />
        )}
      </div>

      <div className="flex flex-col gap-1">
        <p className="text-sm font-medium">Logo da barbearia</p>
        <p className="text-xs text-muted-foreground">JPG, PNG ou WebP, até 2 MB.</p>
        <div className="mt-1 flex gap-2">
          <Button
            type="button"
            size="sm"
            variant="outline"
            disabled={ocupado}
            onClick={() => inputRef.current?.click()}
          >
            {enviando ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
            {mostrando ? "Trocar" : "Enviar"}
          </Button>
          {mostrando && (
            <Button type="button" size="sm" variant="ghost" disabled={ocupado} onClick={remover}>
              {removendo ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
              Remover
            </Button>
          )}
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={aoEscolher}
      />
    </div>
  )
}
