import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar, MobileNav, Footer } from "@/components/layout";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "GC | IIT Ropar",
  description: "General Championship - Where Excellence Competes. The annual inter-hostel competition at IIT Ropar featuring Sports, Tech, and Cultural events.",
  keywords: ["GC", "General Championship", "IIT Ropar", "Sports", "Tech", "Cultural", "Inter-hostel"],
  authors: [{ name: "SoftCom Club, IIT Ropar" }],
  openGraph: {
    title: "GC | IIT Ropar",
    description: "General Championship - Where Excellence Competes",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans antialiased`}>
        <div className="min-h-screen flex flex-col">
          <Sidebar />
          <MobileNav />
          <main className="flex-1 main-content">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
