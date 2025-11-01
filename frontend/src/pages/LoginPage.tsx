import { FormEvent, useEffect, useState } from "react";
import { Link, useLocation, useNavigate, type Location } from "react-router-dom";

import { ErrorState } from "../components/ErrorState";
import { LoadingIndicator } from "../components/LoadingIndicator";
import { useAuth } from "../hooks/useAuth";

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loading, isAuthenticated, error } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const redirectTo =
    ((location.state as { from?: Location } | null)?.from?.pathname as
      | string
      | undefined) ?? "/";

  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate(redirectTo, { replace: true });
    }
  }, [isAuthenticated, loading, navigate, redirectTo]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setSubmitting(true);
    setLocalError(null);

    try {
      await login({ email, password });
      navigate(redirectTo, { replace: true });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Login failed. Please try again.";
      setLocalError(message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading && !isAuthenticated) {
    return <LoadingIndicator message="Starting your session..." />;
  }

  return (
    <div className="auth-layout">
      <div className="auth-card">
        <header className="auth-header">
          <h1>Welcome back</h1>
          <p className="muted">
            Sign in with your library administrator credentials to continue.
          </p>
        </header>

        {(localError || error) && (
          <ErrorState message={localError ?? error ?? "Unable to sign in."} />
        )}

        <form className="stack gap-md" onSubmit={handleSubmit}>
          <label className="form-field">
            <span>Email address</span>
            <input
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              placeholder="admin@example.com"
              disabled={submitting}
            />
          </label>

          <label className="form-field">
            <span>Password</span>
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              placeholder="••••••••"
              disabled={submitting}
            />
          </label>

          <button type="submit" disabled={submitting} className="primary-button">
            {submitting ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <footer className="auth-footer">
          <p className="muted">
            Forgot your credentials? Contact an administrator to reset access.
          </p>
          <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
            <Link className="text-link" to="/register">
              Create account
            </Link>
            <Link className="text-link" to="/">
              Return to dashboard
            </Link>
          </div>
        </footer>
      </div>
    </div>
  );
}
