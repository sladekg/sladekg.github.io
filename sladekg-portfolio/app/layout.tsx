import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Gabrielle Sladek — Product Designer & Strategist",
  description:
    "Selected work in product design, product strategy, project management, and SEO by Gabrielle Sladek.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
