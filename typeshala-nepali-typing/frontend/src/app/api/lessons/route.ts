import { NextRequest, NextResponse } from "next/server";
import { lessons } from "@/data/lessons";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const setType = searchParams.get("setType");
  const language = searchParams.get("language");

  if (setType) {
    let filtered = Object.values(lessons).filter((l) => l.setType === setType);
    if (language) {
      filtered = filtered.filter((l) => l.language === language);
    }
    return NextResponse.json(filtered);
  }

  return NextResponse.json(lessons);
}
