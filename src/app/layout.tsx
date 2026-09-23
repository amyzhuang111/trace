import type { Metadata } from "next";
import { Roboto_Flex, Bai_Jamjuree, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { StoreHydration } from "@/components/layout/StoreHydration";

const robotoFlex = Roboto_Flex({
  variable: "--font-roboto-flex",
  subsets: ["latin"],
});

const baiJamjuree = Bai_Jamjuree({
  variable: "--font-bai-jamjuree",
  weight: ["500", "600", "700"],
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Hilbert — Growth Operator Workbench",
  description: "Northstar Market growth operator workspace — synthetic demo data.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${robotoFlex.variable} ${baiJamjuree.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="h-full">
        <StoreHydration />
        <div className="flex h-full">
          <Sidebar />
          <div className="flex min-w-0 flex-1 flex-col">
            <Header />
            <main className="flex-1 overflow-y-auto scrollbar-thin bg-background">
              <div className="mx-auto max-w-[1440px] px-8 py-8">{children}</div>
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
