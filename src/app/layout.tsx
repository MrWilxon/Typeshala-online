import type { Metadata } from "next";
import { Inter, Noto_Sans_Devanagari } from "next/font/google";
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
  title: "Typeshala - Free Nepali Typing Tutor Online (Preeti Keyboard)",
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='20' fill='%236366f1'/><text x='50' y='68' text-anchor='middle' font-size='55' fill='white' font-family='sans-serif' font-weight='bold'>ट</text></svg>",
  },
  description:
    "Learn Nepali typing online with Typeshala. Practice Preeti and English keyboard layouts with real-time accuracy tracking. Free interactive typing tutor for Nepali language learners. नेपाली टाइपिङ सिक्नुहोस् ।",
  keywords: [
    "Nepali typing tutor",
    "Nepali typing practice",
    "Preeti keyboard",
    "typeshala",
    "Nepali typing online",
    "free typing tutor Nepal",
    "Nepali keyboard layout",
    "टाइपिङ सिक्नुहोस्",
    "नेपाली टाइपिङ",
    "Nepali typing for beginners",
  ],
  authors: [{ name: "Typeshala" }],
  openGraph: {
    title: "Typeshala - Free Nepali Typing Tutor Online",
    description:
      "Learn Nepali typing online with Typeshala. Practice Preeti and English keyboard layouts with real-time accuracy tracking.",
    url: "https://typeshala.shresthasushil.com.np",
    siteName: "Typeshala",
    locale: "ne_NP",
    alternateLocale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Typeshala - Free Nepali Typing Tutor",
    description:
      "Learn Nepali typing online with Typeshala. Practice Preeti and English keyboard layouts.",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://typeshala.shresthasushil.com.np",
    languages: {
      ne: "https://typeshala.shresthasushil.com.np",
      en: "https://typeshala.shresthasushil.com.np/en",
    },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Typeshala - Nepali Typing Tutor",
  url: "https://typeshala.shresthasushil.com.np",
  description:
    "Free interactive Nepali typing tutor supporting Preeti and English keyboard layouts.",
  applicationCategory: "EducationalApplication",
  operatingSystem: "All",
  browserRequirements: "Requires JavaScript",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  inLanguage: ["ne", "en"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ne" className={`${inter.variable} ${notoSansDevanagari.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
