import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ArmX - Train with intent",
  description: "A fast, local-first forearm training log.",
  applicationName: "ArmX",
  appleWebApp: { capable: true, title: "ArmX", statusBarStyle: "black-translucent" },
};

export const viewport: Viewport = {
  themeColor: "#111210",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
