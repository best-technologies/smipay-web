import type { Metadata } from "next";
import { Geist, Geist_Mono, Funnel_Display } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const funnelDisplay = Funnel_Display({
  variable: "--font-funnel-display",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Smipay - Pay with a Smile",
  description:
    "Smipay offers Utilities Payments, Save Money, Buy Data, Buy Airtime, Transfer, Pay Bills, Bet Funding, and lot more. Experience seamless transactions with our user-friendly app designed for your convenience.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${funnelDisplay.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
