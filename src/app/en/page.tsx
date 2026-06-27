import type { Metadata } from "next";
import TypingTutor from "@/components/TypingTutor";

export const metadata: Metadata = {
  title: "Typeshala - Free Online English Typing Tutor | Improve Typing Speed",
  description:
    "Improve your English typing speed with Typeshala free online typing tutor. Practice with real-time WPM tracking, accuracy feedback, and step-by-step lessons. Best web-based typing tutor for beginners.",
  openGraph: {
    title:
      "Typeshala - Free Online English Typing Tutor | Improve Typing Speed",
    description:
      "Improve your English typing speed with Typeshala free online typing tutor. Real-time WPM tracking and accuracy feedback.",
    url: "/en",
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
    canonical: "/en",
    languages: {
      ne: "/",
      en: "/en",
    },
  },
};

export default function EnglishHome() {
  return (
    <main>
      <h1 className="sr-only">
        Typeshala - Free Online English Typing Tutor
      </h1>
      <section aria-label="English typing practice area">
        <TypingTutor initialKeyboardType="english" />
      </section>
    </main>
  );
}
