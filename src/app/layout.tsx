import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VukaSync OS",
  description: "VukaSync premium workspace command center."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
