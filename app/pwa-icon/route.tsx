import { ImageResponse } from "next/og"

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
          background: "#0a0a0a",
        }}
      >
        <svg width="336" height="336" viewBox="0 0 64 64" fill="none">
          <g stroke="#d4b896" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="19" cy="44" r="7" />
            <circle cx="19" cy="20" r="7" />
            <path d="M25 40 48 15M25 24 48 49" />
          </g>
        </svg>
      </div>
    ),
    { width: 512, height: 512 },
  )
}
