import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/lib/contexts/LanguageContext";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  metadataBase: new URL('https://proposligo.vercel.app'),
  title: {
    default: "ProposliGo — AI Proposal Generator for Freelancers",
    template: "%s | ProposliGo"
  },
  description: "Instantly generate high-converting freelance proposals powered by Groq AI. Built for modern freelancers who want to win more projects.",
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "ProposliGo — AI Proposal Generator for Freelancers",
    description: "Instantly generate high-converting freelance proposals powered by Groq AI.",
    url: 'https://proposligo.vercel.app',
    siteName: 'ProposliGo',
    images: [
      {
        url: '/ProposliGo Logo.png',
        width: 1200,
        height: 630,
        alt: 'ProposliGo Logo',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "ProposliGo — AI Proposal Generator for Freelancers",
    description: "Instantly generate high-converting freelance proposals powered by Groq AI.",
    images: ['/ProposliGo Logo.png'],
  },
  keywords: ["AI proposal generator", "freelance proposals", "Upwork cover letter", "Groq AI", "Llama 3", "freelance tools"],
  category: 'business',
};

export const viewport: Viewport = {
  themeColor: '#10b981',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider appearance={{ baseTheme: dark }}>
      <html lang="en" className="dark">
        <body className={`${inter.variable} font-sans bg-zinc-950 text-zinc-50 antialiased min-h-screen`}>
          <LanguageProvider>
            {children}
          </LanguageProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
