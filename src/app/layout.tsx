import type { Metadata } from "next";
import { Fraunces, Outfit } from "next/font/google";
import "./globals.css";

const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
});

const body = Outfit({
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ),
  title: {
    default: "9 Songs of My Life",
    template: "%s · 9 Songs of My Life",
  },
  description:
    "A visual mood board of songs for the stages and moods of a life—open each pin on Spotify or Apple Music.",
  openGraph: {
    type: "website",
    siteName: "9 Songs of My Life",
    title: "9 Songs of My Life",
    description:
      "A Pinterest-style board of life-stage songs. Tap a pin. Play the mood.",
  },
  twitter: {
    card: "summary_large_image",
    title: "9 Songs of My Life",
    description:
      "A visual mood board of nine songs for the stages and moods of a life.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${display.variable} ${body.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
