import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VukaSync OS",
  description: "Technical foundation for the VukaSync OS client portal."
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
