import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { Toaster } from "sonner"

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "YouChat",
  description: "YouChat - мы прочитаем твою переписку и сдадим тебя ментам при первой же возможности!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={inter.className}>
        <Toaster />
        {children}
      </body>
    </html>
  );
}
