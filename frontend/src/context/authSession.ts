import type { User } from "../types/auth";

export const STORAGE_KEY = "devboard_auth";

export function getStoredSession(): {
  user: User;
  accessToken: string;
  refreshToken: string;
} | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw);

    if (
      parsed &&
      typeof parsed.accessToken === "string" &&
      typeof parsed.refreshToken === "string" &&
      parsed.user &&
      typeof parsed.user.id === "string"
    ) {
      return parsed;
    }

    return null;
  } catch {
    return null;
  }
}