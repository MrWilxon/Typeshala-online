import { NextRequest, NextResponse } from "next/server";

interface Score {
  id: number;
  wpm: number;
  accuracy: number;
  lesson: string;
  setType: string;
  createdAt: string;
}

const scores: Score[] = [];

export async function GET() {
  const sorted = [...scores].sort((a, b) => b.wpm - a.wpm);
  return NextResponse.json(sorted);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { wpm, accuracy, lesson, setType } = body;

  if (typeof wpm !== "number" || typeof accuracy !== "number") {
    return NextResponse.json(
      { error: "wpm and accuracy are required numbers" },
      { status: 400 }
    );
  }

  if (wpm < 0 || wpm > 500 || accuracy < 0 || accuracy > 100) {
    return NextResponse.json(
      { error: "wpm must be 0-500, accuracy must be 0-100" },
      { status: 400 }
    );
  }

  const safeLesson = typeof lesson === "string" ? lesson.slice(0, 100) : "";
  const safeSetType = typeof setType === "string" ? setType.slice(0, 50) : "";

  const maxId = scores.reduce((max, s) => Math.max(max, s.id), 0);
  const score: Score = {
    id: maxId + 1,
    wpm,
    accuracy,
    lesson: safeLesson,
    setType: safeSetType,
    createdAt: new Date().toISOString(),
  };
  scores.push(score);

  return NextResponse.json(score, { status: 201 });
}
