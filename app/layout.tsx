import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "ProposliGo — AI Proposal Generator for Freelancers",
  description: "Instantly generate high-converting freelance proposals powered by Groq.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans bg-zinc-950 text-zinc-50 antialiased min-h-screen`}>
        {children}
      </body>
    </html>
  );
}
