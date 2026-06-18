"use client"

import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { useState } from "react"
import { Loader2 } from "lucide-react"

interface GoogleButtonProps {
  redirectPath?: string
  /** Quando true, passa setup_owner=1 no callback — promove o usuário a owner se não houver nenhum */
  setupOwner?: boolean
  label?: string
}

export function GoogleButton({
  redirectPath = "/conta",
  setupOwner = false,
  label = "Entrar com Google",
}: GoogleButtonProps) {
  const [loading, setLoading] = useState(false)

  async function entrarComGoogle() {
    setLoading(true)
    const supabase = createClient()
    const origin = window.location.origin

    // Rota de callback: /auth/callback para equipe, /conta/callback para clientes
    const callbackBase = redirectPath.startsWith("/conta")
      ? `${origin}/conta/callback?next=${encodeURIComponent(redirectPath)}`
      : `${origin}/auth/callback?next=${encodeURIComponent(redirectPath)}${setupOwner ? "&setup_owner=1" : ""}`

    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: callbackBase,
      },
    })
  }

  return (
    <Button
      type="button"
      variant="outline"
      className="w-full"
      onClick={entrarComGoogle}
      disabled={loading}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <svg className="h-4 w-4" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v2.97h3.86c2.26-2.09 3.56-5.17 3.56-8.79z"
          />
          <path
            fill="#34A853"
            d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-2.97c-1.07.72-2.45 1.15-4.07 1.15-3.13 0-5.78-2.11-6.73-4.96H1.27v3.09C3.26 21.3 7.31 24 12 24z"
          />
          <path
            fill="#FBBC05"
            d="M5.27 14.31A7.13 7.13 0 0 1 4.91 12c0-.8.14-1.58.36-2.31V6.6H1.27A11.93 11.93 0 0 0 0 12c0 1.93.46 3.76 1.27 5.4z"
          />
          <path
            fill="#EA4335"
            d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.27 6.6l4 3.09c.95-2.85 3.6-4.94 6.73-4.94z"
          />
        </svg>
      )}
      {label}
    </Button>
  )
}
