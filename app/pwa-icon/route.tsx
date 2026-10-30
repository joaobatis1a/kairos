import { ImageResponse } from "next/og"
import { MarcaIcone, PRETO } from "@/lib/marca-icone"

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
        <MarcaIcone tamanho={380} />
      </div>
    ),
    { width: 512, height: 512 },
  )
}
