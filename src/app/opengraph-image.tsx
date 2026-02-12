import { ImageResponse } from "next/og"

export const runtime = "edge"
export const alt = "Kaboo - Score Tracker for the Card Game"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#09090b",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginBottom: "24px",
          }}
        >
          <svg
            width="72"
            height="72"
            viewBox="0 0 32 32"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M18 4L8 18h6l-2 10 10-14h-6l2-10z" fill="#fbbf24" />
          </svg>
          <div
            style={{
              fontSize: 80,
              fontWeight: 800,
              color: "#fafafa",
              letterSpacing: "-2px",
            }}
          >
            Kaboo
          </div>
        </div>
        <div
          style={{
            fontSize: 28,
            color: "#a1a1aa",
          }}
        >
          Score tracker for the card game
        </div>
      </div>
    ),
    { ...size }
  )
}
