import type { Metadata } from "next";
import { DM_Sans, DM_Serif_Display } from "next/font/google";
import "./globals.css";

const dmSerifDisplay = DM_Serif_Display({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-dm-serif-display",
});

const dmSans = DM_Sans({
  weight: ["500", "600"],
  subsets: ["latin"],
  variable: "--font-dm-sans",
});

export const metadata: Metadata = {
  title: "Gabrielle Sladek — Product Designer & Strategist",
  description:
    "Selected work in product design, product strategy, project management, and SEO by Gabrielle Sladek.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body className={`${dmSerifDisplay.variable} ${dmSans.variable}`}>
        {children}
      </body>
    </html>
  );
}
