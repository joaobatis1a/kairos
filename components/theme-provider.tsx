"use client"

import { ThemeProvider as NextThemesProvider } from "next-themes"
import type { ThemeProviderProps } from "next-themes"
import { usePathname } from "next/navigation"

// A landing de vendas (e as páginas legais linkadas nela) tem uma identidade
// visual própria — fundo quase-preto com dourado — pensada pro tema escuro.
// Sem isso, quem visita depois de já ter trocado pra claro em algum lugar do
// painel/conta (o tema é uma preferência só do app logado, guardada no
// localStorage) via a landing toda lavada, sem o visitante nunca ter pedido
// isso: a landing não tem nem botão de trocar tema. forcedTheme não mexe no
// localStorage — assim que sai dessas rotas, o resto do site volta a
// respeitar a preferência de sempre.
const ROTAS_SEMPRE_ESCURAS = ["/", "/privacidade", "/termos"]

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const pathname = usePathname()
  const forcedTheme = ROTAS_SEMPRE_ESCURAS.includes(pathname) ? "dark" : undefined

  return (
    <NextThemesProvider {...props} forcedTheme={forcedTheme}>
      {children}
    </NextThemesProvider>
  )
}
