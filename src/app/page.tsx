import type { Metadata } from "next";
import TypingTutor from "@/components/TypingTutor";

export const metadata: Metadata = {
  title: "Typeshala - Free Online Nepali Typing Tutor | Learn Nepali Typing",
  description:
    "Learn Nepali typing online for free with Typeshala. Practice Preeti keyboard and Nepali Traditional keyboard with step-by-step lessons, WPM tests, and real-time accuracy tracking. Best Nepali typing tutor for beginners.",
  keywords: [
    "Typeshala",
    "Online Typeshala",
    "Typeshala download",
    "Typeshala for PC",
    "Official Nepali Typeshala",
    "Typeshala online",
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
    "Nepali typing online",
    "Nepali typing speed test",
  ],
  openGraph: {
    title:
      "Typeshala - Free Online Nepali Typing Tutor | Learn Nepali Typing",
    description:
      "Learn Nepali typing online for free with Typeshala. Practice Preeti and Nepali Traditional keyboard layouts with step-by-step lessons and WPM tests.",
    url: "https://typeshala.wilson.com.np",
    siteName: "Typeshala",
    locale: "ne_NP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Typeshala - Free Online Nepali Typing Tutor",
    description:
      "Learn Nepali typing online for free with Typeshala. Practice Preeti and Nepali Traditional keyboard layouts.",
  },
  alternates: {
    canonical: "https://typeshala.wilson.com.np",
    languages: {
      ne: "https://typeshala.wilson.com.np",
      en: "https://typeshala.wilson.com.np/en",
    },
  },
};

const jsonLdNepali = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Typeshala - Nepali Typing Tutor",
  alternateName: [
    "Online Typeshala",
    "Typeshala Online",
    "Nepali Typeshala",
    "Nepali Typeshala Download",
    "Typeshala for PC",
  ],
  url: "https://typeshala.wilson.com.np",
  description:
    "Free interactive Nepali typing tutor. Learn Nepali typing with Preeti keyboard and Traditional keyboard layouts.",
  applicationCategory: "EducationalApplication",
  operatingSystem: "All",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  inLanguage: "ne",
};

export default function Home() {
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdNepali) }}
      />
      <h1
        style={{
          position: "absolute",
          width: 1,
          height: 1,
          overflow: "hidden",
          clip: "rect(0,0,0,0)",
          border: 0,
          margin: -1,
          padding: 0,
          whiteSpace: "nowrap",
        }}
      >
        Typeshala - Free Online Nepali Typing Tutor
      </h1>
      <section aria-label="Nepali typing practice area">
        <TypingTutor />
      </section>
    </main>
  );
}
