import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { funnel, londrina } from '@/lib/fonts';
import "./globals.css";
import SessionProvider from "@/components/SessionProvider";
import { SITE_NAME, SITE_URL } from "@/lib/site";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: SITE_NAME, template: `%s | ${SITE_NAME}` },
  description:
    "Entdecke, speichere und bearbeite leckere Rezepte – von Pasta über Suppen bis Asiatisch.",
  openGraph: { siteName: SITE_NAME, locale: "de_DE", type: "website" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className={`${funnel.variable} ${londrina.variable}`}>
      <body
        
      >
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
