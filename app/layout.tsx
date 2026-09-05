import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FinControl",
  description: "Controle financeiro pessoal",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">{children}</body>
    </html>
  );
}
