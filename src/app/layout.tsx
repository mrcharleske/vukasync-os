import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VukaSync OS",
  description: "VukaSync localhost foundation for Phase 3D."
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
