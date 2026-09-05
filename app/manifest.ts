import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "kairos — agendamento para barbearias",
    short_name: "kairos",
    description: "Agende seu horário e acompanhe seus atendimentos.",
    start_url: "/",
    display: "standalone",
    background_color: "#0a0a0a",
    theme_color: "#0a0a0a",
    icons: [
      { src: "/icon.svg", type: "image/svg+xml", sizes: "any", purpose: "any" },
    ],
  }
}
