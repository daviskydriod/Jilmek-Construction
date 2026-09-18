import { DEMO_PASSWORD, useAuth } from "@/_core/hooks/useAuth";
import { Eye, EyeOff, Lock, ShieldAlert } from "lucide-react";
import { FormEvent, useState } from "react";

/**
 * Auth gate for /admin. This dashboard has no real backend yet, so this is
 * intentionally a soft, obvious "still in dev" gate — not real security. See
 * useAuth.ts for the reasoning.
 *
 * Once authenticated, this just hands off to AdminDashboard's own layout
 * (topbar + bottom tab bar / desktop rail) — no separate sidebar here.
 */
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { loading, user } = useAuth();

  if (loading) {
    return <div className="adm-loading">Loading dashboard…</div>;
  }

  if (!user) {
    return <AdminLogin />;
  }

  return <>{children}</>;
}

function AdminLogin() {
  const { login } = useAuth();
  const [password, setPassword] = useState(DEMO_PASSWORD);
  const [visible, setVisible] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const ok = login(password);
    setError(ok ? null : "Enter a password to continue.");
  };

  return (
    <div className="adm-login">
      <div className="adm-login-image">
        <img
          src="/images/hero-red-roof_78e57ca6.jpeg"
          alt="Completed JILMEK residence with a finished blue hip roof"
        />
        <div className="adm-login-image-overlay" />
        <div className="adm-login-image-content">
          <img
            className="adm-login-logo"
            src="/images/logo_22da56e1.png"
            alt="JILMEK Roofing & Construction Ltd"
            style={{ width: 168, maxWidth: 168, height: "auto" }}
          />
          <h2>Content studio</h2>
          <p>Manage roofing products, listings, photos and enquiries without touching code.</p>
        </div>
      </div>

      <div className="adm-login-panel">
        <form onSubmit={handleSubmit} className="adm-login-form">
          <img
            className="adm-login-logo adm-login-logo-mobile"
            src="/images/logo_22da56e1.png"
            alt="JILMEK Roofing & Construction Ltd"
            style={{ width: 120, maxWidth: 120, height: "auto" }}
          />

          <div className="adm-login-heading">
            <h1>Sign in to continue</h1>
            <p>This dashboard is still in development — sign-in here is a placeholder, not real security.</p>
          </div>

          <div className="adm-login-notice">
            <ShieldAlert size={16} />
            <span>
              Demo mode: any password works. The field below is pre-filled with <b>{DEMO_PASSWORD}</b> so you can
              just hit sign in.
            </span>
          </div>

          <label className="adm-login-field">
            <span>Password</span>
            <div className="adm-login-input">
              <Lock size={16} />
              <input
                type={visible ? "text" : "password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Admin password"
                autoFocus
                autoComplete="off"
              />
              <button
                type="button"
                className="adm-login-toggle"
                onClick={() => setVisible((value) => !value)}
                aria-label={visible ? "Hide password" : "Show password"}
              >
                {visible ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </label>

          {error && <p className="adm-login-error">{error}</p>}

          <button type="submit" className="adm-primary full adm-login-submit">
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
}
