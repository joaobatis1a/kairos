import { ImageResponse } from "next/og"

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
          background: "#12140D",
        }}
      >
        <svg width="220" height="220" viewBox="0 0 64 64" fill="none">
          <g fill="#C8F23C">
            <path d="M10 8h15v48H10z M25 33 43 8h17L38 38 25 40z M31 35.5 38 31 60 56H43z" />
          </g>
          <path d="M-4 46 68 30" stroke="#12140D" strokeWidth="2.6" />
        </svg>
      </div>
    ),
    { width: 512, height: 512 },
  )
}
