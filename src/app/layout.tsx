import type { Metadata } from "next";
import { Playfair_Display, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { GrainOverlay } from "@/components/loading/GrainOverlay";
import { CinematicBackground } from "@/components/ui/CinematicBackground";
import { MouseGlow } from "@/components/ui/MouseGlow";
import { CursorFollower } from "@/components/ui/CursorFollower";
import { AudioProvider } from "@/components/audio/AudioProvider";
import { AudioToggle } from "@/components/audio/AudioToggle";
import { EasterEggProvider } from "@/components/easter-eggs/EasterEggProvider";
import { SecretMemory } from "@/components/easter-eggs/SecretMemory";
import { BackToDashboardButton } from "@/components/ui/BackToDashboardButton";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["300", "400", "500", "600"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "الأرشيف السري",
  description: "رحلة عبر ذكرياتنا",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className={`${playfair.variable} ${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="relative min-h-screen font-body antialiased">
        <AudioProvider>
          <EasterEggProvider>
            <CinematicBackground />
            <GrainOverlay />
            <MouseGlow />
            <CursorFollower />
            <BackToDashboardButton />
            <div className="relative z-[1]">{children}</div>
            <AudioToggle />
            <SecretMemory />
          </EasterEggProvider>
        </AudioProvider>
      </body>
    </html>
  );
}