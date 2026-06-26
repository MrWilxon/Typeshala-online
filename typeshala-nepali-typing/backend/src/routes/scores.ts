import { Router, Request, Response } from "express";
import fs from "fs";
import path from "path";

const DATA_FILE = path.join(__dirname, "..", "..", "data", "scores.json");

interface Score {
  id: number;
  wpm: number;
  accuracy: number;
  lesson: string;
  setType: string;
  createdAt: string;
}

function readScores(): Score[] {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, "utf-8");
      return JSON.parse(raw);
    }
  } catch { /* ignore corrupt file */ }
  return [];
}

function writeScores(scores: Score[]) {
  fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
  fs.writeFileSync(DATA_FILE, JSON.stringify(scores, null, 2), "utf-8");
}

export const scoresRouter = Router();

scoresRouter.get("/", (_req: Request, res: Response) => {
  const scores = readScores().sort((a, b) => b.wpm - a.wpm);
  res.json(scores);
});

scoresRouter.post("/", (req: Request, res: Response) => {
  const { wpm, accuracy, lesson, setType } = req.body;

  if (typeof wpm !== "number" || typeof accuracy !== "number") {
    res.status(400).json({ error: "wpm and accuracy are required numbers" });
    return;
  }

  const scores = readScores();
  const maxId = scores.reduce((max, s) => Math.max(max, s.id), 0);
  const score: Score = {
    id: maxId + 1,
    wpm,
    accuracy,
    lesson: lesson || "",
    setType: setType || "",
    createdAt: new Date().toISOString(),
  };
  scores.push(score);
  writeScores(scores);

  res.status(201).json(score);
});