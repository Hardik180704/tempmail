import type { Metadata } from "next";
import { Outfit, Caveat, Fredoka } from "next/font/google"; 
import "./globals.css";

const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });
const caveat = Caveat({ subsets: ["latin"], variable: "--font-caveat" });
const fredoka = Fredoka({ subsets: ["latin"], variable: "--font-fredoka" });

export const metadata: Metadata = {
  title: "TempMail - Disposable Email Address",
  description: "Forget about spam, advertising mailings, hacking and attacking robots.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.variable} ${caveat.variable} ${fredoka.variable} font-sans`}>{children}</body>
    </html>
  );
}
