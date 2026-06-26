import type { Metadata } from "next";
import TypingTutor from "@/components/TypingTutor";

export const metadata: Metadata = {
  title: "Typeshala - Free Online English Typing Tutor | Improve Typing Speed",
  description:
    "Improve your English typing speed with Typeshala free online typing tutor. Practice with real-time WPM tracking, accuracy feedback, and step-by-step lessons. Best web-based typing tutor for beginners.",
  keywords: [
    "Online Typing",
    "Typeshala",
    "Online Typeshala",
    "Typeshala online",
    "Web-based Typeshala",
    "Typeshala alternative",
    "Modern typing tutor",
    "typing tutor for beginners",
    "improve typing speed",
    "typing WPM test",
    "free typing tutor online",
    "best typing tutor",
    "typing practice online",
    "step-by-step typing lessons",
    "typing game",
  ],
  openGraph: {
    title:
      "Typeshala - Free Online English Typing Tutor | Improve Typing Speed",
    description:
      "Improve your English typing speed with Typeshala free online typing tutor. Real-time WPM tracking and accuracy feedback.",
    url: "https://typeshala.wilson.com.np/en",
    siteName: "Typeshala",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Typeshala - Free Online English Typing Tutor",
    description:
      "Improve your English typing speed with Typeshala free online typing tutor.",
  },
  alternates: {
    canonical: "https://typeshala.wilson.com.np/en",
    languages: {
      ne: "https://typeshala.wilson.com.np",
      en: "https://typeshala.wilson.com.np/en",
    },
  },
};

const jsonLdEnglish = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Typeshala - English Typing Tutor",
  alternateName: ["Online Typing Tutor", "Typeshala Online"],
  url: "https://typeshala.wilson.com.np/en",
  description:
    "Free interactive English typing tutor with real-time WPM tracking and accuracy feedback.",
  applicationCategory: "EducationalApplication",
  operatingSystem: "All",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  inLanguage: "en",
};

export default function EnglishHome() {
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdEnglish) }}
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
        Typeshala - Free Online English Typing Tutor
      </h1>
      <section aria-label="English typing practice area">
        <TypingTutor initialKeyboardType="english" />
      </section>
    </main>
  );
}
