import "server-only";

import { cookies } from "next/headers";
import { getDb } from "./store";
import type { Profile } from "./types";

export const SESSION_COOKIE = "vre_session";

export async function getSession(): Promise<Profile | null> {
  const store = await cookies();
  const userId = store.get(SESSION_COOKIE)?.value;
  if (!userId) return null;
  const profile = getDb().profiles.find((p) => p.id === userId);
  return profile ?? null;
}

export async function requireResponder(): Promise<Profile> {
  const session = await getSession();
  if (!session || (session.role !== "responder" && session.role !== "admin")) {
    throw new Error("Unauthorized");
  }
  return session;
}

export async function requireAdmin(): Promise<Profile> {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    throw new Error("Unauthorized");
  }
  return session;
}
