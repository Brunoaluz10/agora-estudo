import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/ui/navigation";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { AulasProvider } from "@/lib/aulas-context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Agora Estudo - Sistema de Gestão de Estudos",
  description: "Plataforma para gerenciar aulas, acompanhar progresso e otimizar seus estudos",
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider>
          <AulasProvider>
            <Navigation />
            {children}
          </AulasProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
