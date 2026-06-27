import type { Metadata } from "next";
import TypingTutor from "@/components/TypingTutor";

export const metadata: Metadata = {
  title: "Typeshala - Free Online Nepali Typing Tutor | Learn Nepali Typing",
  description:
    "Learn Nepali typing online for free with Typeshala. Practice Preeti keyboard and Nepali Traditional keyboard with step-by-step lessons, WPM tests, and real-time accuracy tracking. Best Nepali typing tutor for beginners.",
  openGraph: {
    title:
      "Typeshala - Free Online Nepali Typing Tutor | Learn Nepali Typing",
    description:
      "Learn Nepali typing online for free with Typeshala. Practice Preeti and Nepali Traditional keyboard layouts with step-by-step lessons and WPM tests.",
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
    canonical: "/",
    languages: {
      ne: "/",
      en: "/en",
    },
  },
};

export default function Home() {
  return (
    <main>
      <h1 className="sr-only">Typeshala - Free Online Nepali Typing Tutor</h1>
      <section aria-label="Nepali typing practice area">
        <TypingTutor />
      </section>
    </main>
  );
}
