import type { Metadata, Viewport } from "next";
import "./globals.css";
import { PwaRegister } from "../components/pwa-register";

export const metadata: Metadata = {
  title: "Isla Puente",
  metadataBase: new URL("https://isla-puente.vercel.app"),
  alternates: { canonical: "/" },
  openGraph: {
    type: "website", url: "/", siteName: "Isla Puente", locale: "es_AR",
    title: "Isla Puente · ¿Hay playa en la punta?",
    description: "Un mapa vivo para consultar la playa de Isla Puente y el nivel del río Paraná.",
    images: [{ url: "/og-isla-puente.png", width: 1200, height: 630, alt: "Isla Puente y su entorno, con el monte como protagonista y la punta marcada en amarillo y verde." }],
  },
  twitter: {
    card: "summary_large_image", title: "Isla Puente · ¿Hay playa en la punta?",
    description: "Consultá la playa de Isla Puente y el nivel del río Paraná.",
    images: ["/og-isla-puente.png"],
  },
  applicationName: "Isla Puente",
  appleWebApp: { capable: true, title: "Isla Puente", statusBarStyle: "default" },
  icons: { icon: [{ url: "/favicon.ico", sizes: "16x16 32x32 48x48 64x64", type: "image/x-icon" }], apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" }] },
  description: "Cuánta playa hay en la punta de Isla Puente, según la altura del río Paraná publicada por Prefectura.",
};

export const viewport: Viewport = { themeColor: "#F5F4E9" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es-AR"><body><PwaRegister />{children}</body></html>;
}
