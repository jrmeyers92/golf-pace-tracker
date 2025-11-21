import Footer from "@/components/Footer";
import Nav from "@/components/Nav";
import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Golf Pace Tracker | Know Your Round Time Before You Go",
    template: "%s | Golf Pace Tracker",
  },
  description:
    "Find real pace of play data for golf courses. See how long rounds actually take based on time of day, day of week, and group size. Submit your round times to help other golfers.",
  keywords: [
    "golf pace of play",
    "golf round time",
    "how long does golf take",
    "golf course pace",
    "golf tee times",
    "golf round duration",
    "slow play golf",
    "fast golf courses",
  ],
  authors: [{ name: "Golf Pace Tracker" }],
  creator: "Golf Pace Tracker",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://golfpacetracker.com", // Update with your actual domain
    siteName: "Golf Pace Tracker",
    title: "Golf Pace Tracker | Know Your Round Time Before You Go",
    description:
      "Find real pace of play data for golf courses. See how long rounds actually take based on community-submitted data.",
    images: [
      {
        url: "/og-image.png", // You'll need to create this
        width: 1200,
        height: 630,
        alt: "Golf Pace Tracker",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Golf Pace Tracker | Know Your Round Time Before You Go",
    description:
      "Find real pace of play data for golf courses. See how long rounds actually take.",
    images: ["/og-image.png"], // You'll need to create this
    creator: "@golfpacetracker", // Update with your Twitter handle
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  alternates: {
    canonical: "https://golfpacetracker.com", // Update with your actual domain
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#16a34a" />
        <link rel="canonical" href="https://golfpacetracker.com" />
      </head>
      <ClerkProvider>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <Nav />
          {children}
          <Footer />
        </body>
      </ClerkProvider>
    </html>
  );
}
