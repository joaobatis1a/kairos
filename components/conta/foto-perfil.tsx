"use client"

import { useRef, useState, useTransition } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { enviarFotoCliente, removerFotoCliente } from "@/app/actions/perfil-cliente"
import { toast } from "sonner"
import { Camera, Trash2, Loader2 } from "lucide-react"

/**
 * Foto de perfil com pré-visualização imediata.
 *
 * A prévia local (URL.createObjectURL) aparece antes do upload terminar,
 * então a troca parece instantânea mesmo em conexão ruim — e se o envio
 * falhar, volta pra foto anterior.
 */
export function FotoPerfil({
  nome,
  fotoUrl,
}: {
  nome: string
  fotoUrl: string | null
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [previa, setPrevia] = useState<string | null>(null)
  const [enviando, startEnvio] = useTransition()
  const [removendo, startRemocao] = useTransition()

  const mostrando = previa ?? fotoUrl
  const inicial = nome.trim()[0]?.toUpperCase() || "?"
  const ocupado = enviando || removendo

  function aoEscolher(e: React.ChangeEvent<HTMLInputElement>) {
    const arquivo = e.target.files?.[0]
    e.target.value = "" // permite reescolher o mesmo arquivo depois
    if (!arquivo) return

    const local = URL.createObjectURL(arquivo)
    setPrevia(local)

    const dados = new FormData()
    dados.set("foto", arquivo)

    startEnvio(async () => {
      const res = await enviarFotoCliente(dados)
      URL.revokeObjectURL(local)
      if (!res.ok) {
        setPrevia(null) // desfaz a prévia: o servidor recusou
        toast.error(res.error ?? "Não foi possível enviar a foto.")
        return
      }
      toast.success("Foto atualizada.")
    })
  }

  function remover() {
    startRemocao(async () => {
      const res = await removerFotoCliente()
      if (!res.ok) {
        toast.error(res.error ?? "Não foi possível remover a foto.")
        return
      }
      setPrevia(null)
      toast.success("Foto removida.")
    })
  }

  return (
    <div className="flex flex-wrap items-center gap-5">
      <div className="group relative">
        <Avatar className="h-24 w-24 ring-2 ring-border transition-all duration-300 group-hover:ring-primary/50">
          {mostrando && <AvatarImage src={mostrando} alt="" className="object-cover" />}
          <AvatarFallback className="bg-primary/15 font-serif text-3xl font-bold text-primary">
            {inicial}
          </AvatarFallback>
        </Avatar>

        {/* o botão cobre o avatar inteiro: a foto toda é o alvo de clique */}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={ocupado}
          aria-label="Trocar foto de perfil"
          className="absolute inset-0 flex items-center justify-center rounded-full bg-black/55 opacity-0 transition-opacity duration-200 hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed"
        >
          {enviando ? (
            <Loader2 className="h-6 w-6 animate-spin text-white" aria-hidden />
          ) : (
            <Camera className="h-6 w-6 text-white" aria-hidden />
          )}
        </button>

        {enviando && (
          <span className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-full bg-black/55">
            <Loader2 className="h-6 w-6 animate-spin text-white" aria-hidden />
          </span>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="rounded-full font-bold"
            disabled={ocupado}
            onClick={() => inputRef.current?.click()}
          >
            <Camera className="h-4 w-4" aria-hidden />
            {mostrando ? "Trocar foto" : "Adicionar foto"}
          </Button>
          {mostrando && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="rounded-full text-muted-foreground"
              disabled={ocupado}
              onClick={remover}
            >
              {removendo ? (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              ) : (
                <Trash2 className="h-4 w-4" aria-hidden />
              )}
              Remover
            </Button>
          )}
        </div>
        <p className="text-xs text-muted-foreground">JPG, PNG ou WebP, até 2 MB.</p>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="sr-only"
        onChange={aoEscolher}
      />
    </div>
  )
}
