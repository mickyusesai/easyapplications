import { randomUUID } from "crypto";
import type { ProjectType } from "./claude";

interface PendingEvaluation {
  email: string;
  projectType: ProjectType;
  buffer: Buffer;
  fileName: string;
  createdAt: number;
}

const store = new Map<string, PendingEvaluation>();

const TTL_MS = 60 * 60 * 1000; // 1 hour

function cleanup() {
  const now = Date.now();
  for (const [key, entry] of store) {
    if (now - entry.createdAt > TTL_MS) {
      store.delete(key);
    }
  }
}

export function storePending(data: Omit<PendingEvaluation, "createdAt">): string {
  cleanup();
  const key = randomUUID();
  store.set(key, { ...data, createdAt: Date.now() });
  return key;
}

export function retrievePending(key: string): Omit<PendingEvaluation, "createdAt"> | null {
  cleanup();
  const entry = store.get(key);
  if (!entry) return null;
  store.delete(key);
  const { createdAt: _, ...data } = entry;
  return data;
}
