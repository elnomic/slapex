import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Slapex - Slap Back Into Discipline",
  description: "Real-time accountability for traders. Break the cycle of boredom trading.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-black text-white antialiased">
        {children}
      </body>
    </html>
  );
}
