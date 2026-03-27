import type { User } from "../types/auth";

export const STORAGE_KEY = "devboard_auth";
export type StoredSession = {
  user: User;
  accessToken: string;
  refreshToken: string;
};
export function getStoredSession(): StoredSession | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  const parsed = JSON.parse(raw);
  if (
  parsed &&
  typeof parsed.accessToken === "string" &&
  typeof parsed.refreshToken === "string" &&
  parsed.user &&
  typeof parsed.user.id === "string" &&
  typeof parsed.user.displayName === "string" &&
  typeof parsed.user.email === "string" &&
  parsed.accessToken.length > 0 &&
  parsed.refreshToken.length > 0 &&
  parsed.user.id.length > 0 &&
  parsed.user.displayName.length > 0 &&
  parsed.user.email.length > 0
    ) {
      return parsed;
    }
  // Malformed session: remove from storage
  localStorage.removeItem(STORAGE_KEY);
  return null;
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

export function saveStoredSession(session: StoredSession) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
}

export function clearStoredSession() {
  localStorage.removeItem(STORAGE_KEY);
}