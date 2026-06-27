import type { Metadata } from "next";
import { Inter, Noto_Sans_Devanagari } from "next/font/google";
import { SITE, SEO_KEYWORDS, ICON_SVG } from "@/lib/seo";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const notoSansDevanagari = Noto_Sans_Devanagari({
  subsets: ["devanagari"],
  display: "swap",
  variable: "--font-noto-devanagari",
});

export const metadata: Metadata = {
  title: {
    default: SITE.title,
    template: "%s | Typeshala - Nepali Typing Tutor",
  },
  icons: {
    icon: ICON_SVG,
    apple: ICON_SVG,
  },
  description: SITE.description,
  keywords: SEO_KEYWORDS.nepali,
  authors: [{ name: "Typeshala" }],
  creator: "Typeshala",
  publisher: "Typeshala",
  metadataBase: new URL(SITE.url),
  openGraph: {
    title: SITE.title,
    description:
      "Learn Nepali typing online with Typeshala. Practice Preeti and English keyboard layouts with real-time accuracy tracking. Free interactive typing tutor for Nepali language learners.",
    siteName: "Typeshala - Nepali Typing Tutor",
    locale: "ne_NP",
    alternateLocale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Typeshala - Free Online Nepali Typing Tutor",
    description:
      "Learn Nepali typing online with Typeshala. Practice Preeti and English keyboard layouts with real-time accuracy tracking.",
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
  alternates: {
    canonical: "/",
    languages: {
      ne: "/",
      en: "/en",
    },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Typeshala - Nepali Typing Tutor",
  alternateName: [
    "Online Typeshala",
    "Typeshala Online",
    "Nepali Typeshala",
    "Typeshala Nepali Typing",
  ],
  url: SITE.url,
  description:
    "Free interactive Nepali typing tutor supporting Preeti and English keyboard layouts. Learn Nepali typing step by step with lessons, WPM tests, and real-time feedback.",
  applicationCategory: "EducationalApplication",
  operatingSystem: "All",
  browserRequirements: "Requires JavaScript",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  inLanguage: ["ne", "en"],
  featureList: [
    "Nepali typing practice with Preeti keyboard",
    "English keyboard typing practice",
    "Real-time WPM and accuracy tracking",
    "Step-by-step typing lessons",
    "Multiple difficulty levels",
    "Sound effects and feedback",
    "Achievement system",
    "High score leaderboard",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="ne"
      className={`${inter.variable} ${notoSansDevanagari.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <meta name="theme-color" content="#6366f1" />
      </head>
      <body>{children}</body>
    </html>
  );
}
