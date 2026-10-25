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
          background: "#0E221B",
        }}
      >
        <svg width="118" height="118" viewBox="0 0 64 64" fill="none">
          <g fill="#C9763A">
            <path d="M10 8h15v48H10z M25 33 43 8h17L38 38 25 40z M31 35.5 38 31 60 56H43z" />
          </g>
          <path d="M-4 46 68 30" stroke="#0E221B" strokeWidth="2.6" />
        </svg>
      </div>
    ),
    size,
  )
}
