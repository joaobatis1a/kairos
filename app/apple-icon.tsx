import { ImageResponse } from "next/og"
import { MarcaIcone, PRETO } from "@/lib/marca-icone"

export const size = { width: 180, height: 180 }
export const contentType = "image/png"

export default function AppleIcon() {
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
        <MarcaIcone tamanho={132} />
      </div>
    ),
    size,
  )
}
