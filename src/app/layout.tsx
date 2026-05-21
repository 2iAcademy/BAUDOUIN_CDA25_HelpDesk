import "./globals.css";
import type { Metadata } from "next";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
import ToastProvider from "@/providers/ToastProvider";
config.autoAddCss = false;

export const metadata: Metadata = {
  title: "HelpDesk",
  description:
    "Un outil en ligne personnalisé pour la gestion de vos tickets",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className="min-h-screen flex flex-col">
        <main className="flex-1">{children}</main>
        <ToastProvider />
      </body>
    </html>
  );
}
