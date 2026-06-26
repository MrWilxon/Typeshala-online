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
  title: {
    default:
      "Typeshala - Free Online Nepali Typing Tutor | Learn Nepali Typing",
    template: "%s | Typeshala - Nepali Typing Tutor",
  },
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='20' fill='%236366f1'/><text x='50' y='68' text-anchor='middle' font-size='55' fill='white' font-family='sans-serif' font-weight='bold'>ट</text></svg>",
    apple:
      "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='20' fill='%236366f1'/><text x='50' y='68' text-anchor='middle' font-size='55' fill='white' font-family='sans-serif' font-weight='bold'>ट</text></svg>",
  },
  description:
    "Typeshala is the best free online Nepali typing tutor. Learn Nepali typing with Preeti keyboard and English keyboard layouts. Practice typing, improve your WPM speed, and master Nepali typing step by step. नेपाली टाइपिङ सिक्नुहोस् - Typeshala डाउनलोड गर्नुहोस्।",
  keywords: [
    "Typeshala",
    "Online Typeshala",
    "Typeshala download",
    "Typeshala for PC",
    "Official Nepali Typeshala",
    "Typeshala online",
    "Online Typing",
    "Learn Nepali typing",
    "Nepali typing practice",
    "How to improve Nepali typing speed",
    "Nepali typing tutor for beginners",
    "Step-by-step Nepali typing lessons",
    "Best software to learn Nepali typing",
    "Nepali Romanized typing tutor",
    "Nepali Traditional keyboard practice",
    "Nepali typing WPM test",
    "Typeshala alternative",
    "Modern Nepali typing tutor",
    "Web-based Typeshala",
    "Nepali typing game",
    "Best typing tutor for Nepali language",
    "Nepali typing tutor",
    "Preeti keyboard",
    "Nepali keyboard layout",
    "free typing tutor Nepal",
    "नेपाली टाइपिङ",
    "टाइपिङ सिक्नुहोस्",
    "Nepali typing online",
    "Nepali typing for beginners",
    "Nepali typing speed test",
  ],
  authors: [{ name: "Typeshala" }],
  creator: "Typeshala",
  publisher: "Typeshala",
  metadataBase: new URL("https://typeshala.wilson.com.np"),
  openGraph: {
    title:
      "Typeshala - Free Online Nepali Typing Tutor | Learn Nepali Typing",
    description:
      "Learn Nepali typing online with Typeshala. Practice Preeti and English keyboard layouts with real-time accuracy tracking. Free interactive typing tutor for Nepali language learners.",
    url: "https://typeshala.wilson.com.np",
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
    canonical: "https://typeshala.wilson.com.np",
    languages: {
      ne: "https://typeshala.wilson.com.np",
      en: "https://typeshala.wilson.com.np/en",
    },
  },
  verification: {},
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
  url: "https://typeshala.wilson.com.np",
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
  softwareHelp: {
    "@type": "CreativeWork",
    url: "https://typeshala.wilson.com.np",
  },
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
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#6366f1" />
        <link rel="canonical" href="https://typeshala.wilson.com.np" />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
