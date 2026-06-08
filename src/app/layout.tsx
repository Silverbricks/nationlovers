import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "NationLovers 🇦🇺 — Australia's Civic Voice",
    template: "%s | NationLovers 🇦🇺",
  },
  description:
    "Report Australian issues, suggest solutions, and drive real change — issue by issue, solution by solution.",
  keywords: ["Australia", "civic", "issues", "solutions", "community", "government"],
  authors: [{ name: "NationLovers Australia" }],
  metadataBase: new URL("http://localhost:3001"),
  openGraph: {
    title: "NationLovers 🇦🇺 — Australia's Civic Voice",
    description: "Report issues. Suggest fixes. Drive real change across Australia.",
    locale: "en_AU",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-AU" className="scroll-smooth">
      <body className={inter.className}>
        <Providers>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
