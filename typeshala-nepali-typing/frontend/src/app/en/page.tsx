import TypingTutor from "@/components/TypingTutor";

export default function EnglishHome() {
  return (
    <main>
      <h1 style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0,0,0,0)", border: 0, margin: -1, padding: 0, whiteSpace: "nowrap" }}>Typeshala - Free English Typing Tutor</h1>
      <section aria-label="English typing practice area">
        <TypingTutor initialKeyboardType="english" />
      </section>
    </main>
  );
}
