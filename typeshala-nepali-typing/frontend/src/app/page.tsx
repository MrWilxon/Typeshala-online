import TypingTutor from "@/components/TypingTutor";

export default function Home() {
  return (
    <main>
      <h1 style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0,0,0,0)", border: 0, margin: -1, padding: 0, whiteSpace: "nowrap" }}>
        Typeshala - Free Nepali Typing Tutor
      </h1>
      <section aria-label="Nepali typing practice area">
        <TypingTutor />
      </section>
    </main>
  );
}
