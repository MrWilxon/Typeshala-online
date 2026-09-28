import type { Metadata } from "next";
import TypingTutor from "@/components/TypingTutor";

export const metadata: Metadata = {
  title: "Typeshala Embed - Nepali Typing Tutor",
  description: "Embeddable Nepali typing tutor widget.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function EmbedHome() {
  return (
    <main>
      <h1 className="sr-only">Typeshala - Nepali Typing Tutor (Embedded)</h1>
      <section aria-label="Nepali typing practice area">
        <TypingTutor />
      </section>
    </main>
  );
}
