import { useCallback, useState } from "react";

/**
 * Lightweight client-only admin gate for the /admin dashboard.
 *
 * There is no backend yet. This project previously relied on a Manus-hosted
 * OAuth service plus a tRPC/Express/MySQL server, all of which have been
 * removed so the site can ship as a plain static build to cPanel hosting.
 *
 * Until a real PHP API (with proper server-side sessions) is wired up,
 * access to /admin is gated by a single shared password set at build time
 * via the VITE_ADMIN_PASSWORD env var. This is NOT secure against a
 * determined visitor — the password ships inside the JS bundle like any
 * other client-side check — it only keeps casual visitors out of the demo
 * CMS. Replace this with real PHP-backed authentication (sessions/JWT
 * issued by your PHP API) before relying on it to protect real data.
 */

const STORAGE_KEY = "jilmek-admin-authed";

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
    const expected = import.meta.env.VITE_ADMIN_PASSWORD as string | undefined;
    if (!expected) {
      console.warn(
        "VITE_ADMIN_PASSWORD is not set — set it in your .env file to enable admin login."
      );
      return false;
    }
    if (password === expected) {
      try {
        sessionStorage.setItem(STORAGE_KEY, "1");
      } catch {
        // sessionStorage unavailable (e.g. private browsing) — still allow
        // access for this render, it just won't persist across reloads.
      }
      setIsAuthenticated(true);
      return true;
    }
    return false;
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
