import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "kukh elia",
    short_name: "kukh elia",
    description: "kukh elia coffee & baked goods Loyalty Pass & Rewards",
    start_url: "/customer",
    display: "standalone",
    background_color: "#879B59",
    theme_color: "#879B59",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
    shortcuts: [
      {
        name: "Cashier POS Terminal",
        short_name: "Cashier POS",
        description: "Open Cashier POS Checkout Terminal",
        url: "/cashier",
        icons: [{ src: "/icon-192.png", sizes: "192x192" }],
      },
      {
        name: "Customer Digital Pass",
        short_name: "Customer Pass",
        description: "Open Member Loyalty Pass",
        url: "/customer",
        icons: [{ src: "/icon-192.png", sizes: "192x192" }],
      },
    ],
  };
}
