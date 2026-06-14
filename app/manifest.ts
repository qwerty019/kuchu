import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "KUCHU — Родная Аптека",
    short_name: "KUCHU",
    description:
      "Сеть аптек «Kuchu» с доставкой. Родная Аптека Республики Саха",
    start_url: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#F3F2F2",
    theme_color: "#A03968",
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
