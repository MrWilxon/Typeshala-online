import express from "express";
import cors from "cors";
import { lessonsRouter } from "./routes/lessons";
import { scoresRouter } from "./routes/scores";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.use("/api/lessons", lessonsRouter);
app.use("/api/scores", scoresRouter);

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});