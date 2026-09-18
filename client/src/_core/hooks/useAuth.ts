import { useCallback, useState } from "react";

/**
 * Lightweight client-only admin gate for the /admin dashboard.
 *
 * There is no backend yet, and this dashboard is still in active
 * development, so the "login" here is intentionally NOT real security —
 * it's just a screen so the dashboard isn't wide open with no gate at all.
 * The demo password is shown right on the login screen rather than hidden,
 * and any non-empty value is accepted once a real VITE_ADMIN_PASSWORD isn't
 * set, so testing this never blocks anyone on the team.
 *
 * Replace this with real PHP-backed authentication (sessions/JWT issued by
 * your PHP API) before this dashboard handles real client data.
 */

const STORAGE_KEY = "jilmek-admin-authed";
export const DEMO_PASSWORD = "jilmek2026";

export type AdminUser = { name: string; email: string };

const ADMIN_USER: AdminUser = { name: "Admin", email: "admin@jilmek.local" };

function readStoredAuth(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return sessionStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(readStoredAuth);

  const login = useCallback((password: string) => {
    const configured = import.meta.env.VITE_ADMIN_PASSWORD as string | undefined;
    // Dev mode: no password configured yet, so anything non-empty gets in —
    // this dashboard has no real data behind it until the PHP API exists.
    const expected = configured && configured.length > 0 ? configured : DEMO_PASSWORD;
    const ok = password.trim().length > 0 && (password === expected || !configured);
    if (ok) {
      try {
        sessionStorage.setItem(STORAGE_KEY, "1");
      } catch {
        // sessionStorage unavailable (e.g. private browsing) — still allow
        // access for this render, it just won't persist across reloads.
      }
      setIsAuthenticated(true);
    }
    return ok;
  }, []);

  const logout = useCallback(() => {
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
    setIsAuthenticated(false);
  }, []);

  return {
    user: isAuthenticated ? ADMIN_USER : null,
    loading: false as const,
    error: null as null,
    isAuthenticated,
    login,
    logout,
    refresh: () => {},
  };
}
