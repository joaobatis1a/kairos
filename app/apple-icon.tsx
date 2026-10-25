import { ImageResponse } from "next/og"

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
          background: "#0a0a0a",
        }}
      >
        <svg width="118" height="118" viewBox="0 0 64 64" fill="none">
          <g fill="#e0a526">
            <rect x="13" y="9" width="9" height="46" rx="2.5" />
            <path d="M27 31.5 47.2 8.6a2.1 2.1 0 0 1 3.5 2.3L34 36.5z" />
            <path d="M27 40.5 35 36 52.6 53.4a2.1 2.1 0 0 1-1.5 3.6h-6.4z" />
          </g>
        </svg>
      </div>
    ),
    size,
  )
}
