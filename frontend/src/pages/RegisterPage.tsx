import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { ErrorState } from "../components/ErrorState";
import { LoadingIndicator } from "../components/LoadingIndicator";
import { authApi } from "../api/auth";
import { useAuth } from "../hooks/useAuth";

export function RegisterPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const response = await authApi.register({ email, password });
      // reuse login flow by applying token and user
      await login({ email, password });
      navigate("/", { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-layout">
      <div className="auth-card">
        <header className="auth-header">
          <h1>Create an account</h1>
          <p className="muted">Register as a viewer to browse the catalog.</p>
        </header>

        {error && <ErrorState message={error} />}

        <form className="stack gap-md" onSubmit={handleSubmit}>
          <label className="form-field">
            <span>Email address</span>
            <input
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              disabled={submitting}
            />
          </label>

          <label className="form-field">
            <span>Password</span>
            <input
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              placeholder="At least 8 characters"
              disabled={submitting}
            />
          </label>

          <button type="submit" className="primary-button" disabled={submitting}>
            {submitting ? "Creating account..." : "Create account"}
          </button>
        </form>

        <footer className="auth-footer">
          <p className="muted">Already have an account?</p>
          <Link className="text-link" to="/login">
            Sign in
          </Link>
        </footer>
      </div>
    </div>
  );
}
