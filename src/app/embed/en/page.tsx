import type { Metadata } from "next";
import TypingTutor from "@/components/TypingTutor";

export const metadata: Metadata = {
  title: "Typeshala Embed - English Typing Tutor",
  description: "Embeddable English typing tutor widget.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function EmbedEnglishHome() {
  return (
    <main>
      <h1 className="sr-only">Typeshala - English Typing Tutor (Embedded)</h1>
      <section aria-label="English typing practice area">
        <TypingTutor initialKeyboardType="english" />
      </section>
    </main>
  );
}
