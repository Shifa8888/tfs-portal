import type { Metadata } from "next";
import { AppProvider } from "@/lib/context";
import "./globals.css";

export const metadata: Metadata = {
  title: "Academy TSF - Futuristic Portal",
  description: "Academy TSF - Next Generation Learning Portal System",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="theme-neon cyber-bg">
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
