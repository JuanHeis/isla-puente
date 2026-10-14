import type { Metadata, Viewport } from "next";
import "./globals.css";
import { PwaRegister } from "../components/pwa-register";

export const metadata: Metadata = {
  title: "Isla Puente",
  applicationName: "Isla Puente",
  appleWebApp: { capable: true, title: "Isla Puente", statusBarStyle: "default" },
  icons: { icon: [{ url: "/favicon.ico", sizes: "16x16 32x32 48x48 64x64", type: "image/x-icon" }], apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" }] },
  description: "Cuánta playa hay en la punta de Isla Puente, según la altura del río Paraná publicada por Prefectura.",
};

export const viewport: Viewport = { themeColor: "#F5F4E9" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es-AR"><body><PwaRegister />{children}</body></html>;
}
