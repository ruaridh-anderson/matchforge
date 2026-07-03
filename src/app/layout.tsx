import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Matchforge - Matchday Graphics",
  description: "A modular live matchday graphics editor for sports teams.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
