import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ArmX",
    short_name: "ArmX",
    description: "Un carnet d'entraînement des avant-bras, rapide et privé.",
    start_url: "/",
    display: "standalone",
    background_color: "#111210",
    theme_color: "#111210",
    orientation: "portrait",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" }, { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "maskable" }],
  };
}
