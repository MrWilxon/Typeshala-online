const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

export interface ScorePayload {
  wpm: number;
  accuracy: number;
  lesson: string;
  setType: string;
}

function silentFetch(url: string, init?: RequestInit): Promise<Response | null> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 3000);
  const callerSignal = init?.signal;
  if (callerSignal) {
    if (callerSignal.aborted) {
      controller.abort();
    } else {
      callerSignal.addEventListener("abort", () => controller.abort(), { once: true });
    }
  }
  return fetch(url, { ...init, signal: controller.signal })
    .finally(() => clearTimeout(timeout))
    .catch(() => null);
}

export async function saveScore(score: ScorePayload): Promise<void> {
  const res = await silentFetch(`${API_BASE}/scores`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(score),
  });
  if (res && !res.ok) { /* backend may not be running */ }
}

export async function getScores(signal?: AbortSignal): Promise<ScorePayload[]> {
  const res = await silentFetch(`${API_BASE}/scores`, { signal });
  if (!res || !res.ok) return [];
  try {
    return await res.json();
  } catch {
    return [];
  }
}
