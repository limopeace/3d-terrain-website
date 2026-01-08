import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mountain Vista Resort | Luxury Blue Ridge Experience",
  description: "Journey to the ultimate adventure paradise in the heart of the Blue Ridge mountains. Explore our interactive 3D terrain and discover exclusive ownership opportunities.",
  keywords: ["luxury resort", "blue ridge", "mountain resort", "real estate", "vacation homes"],
  openGraph: {
    title: "Mountain Vista Resort | Luxury Blue Ridge Experience",
    description: "Journey to the ultimate adventure paradise in the heart of the Blue Ridge mountains.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
