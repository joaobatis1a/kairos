import { ImageResponse } from "next/og"
import { MarcaIcone, PRETO } from "@/lib/marca-icone"

// Ícone com folga (safe zone) pro Android recortar em círculo/quadrado
// arredondado sem cortar o desenho — conteúdo ocupa só a área central.
export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: PRETO,
        }}
      >
        <MarcaIcone tamanho={250} />
      </div>
    ),
    { width: 512, height: 512 },
  )
}
