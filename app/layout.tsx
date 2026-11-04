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
  title: "Sharon Epic Armando — Artist & Developer",
  description:
    "Artist — singer, comic artist, designer, performer. Developer — builds and deploys the web projects, AI tools, and quantum visualizations that come out of that work.",
  openGraph: {
    title: "Sharon Epic Armando — Artist & Developer",
    description: "Artist — singer, comic artist, designer, performer. Developer — builds and deploys the web projects, AI tools, and quantum visualizations that come out of that work.",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Sharon Epic Armando — Artist & Developer",
    description: "Artist — singer, comic artist, designer, performer. Developer — builds and deploys the web projects, AI tools, and quantum visualizations that come out of that work.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
