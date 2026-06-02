import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../api/client.js";
import { useAuth } from "../hooks/useAuth.js";

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError("");

    try {
      const result = await apiRequest("/auth/login", {
        method: "POST",
        body: JSON.stringify(form)
      });

      login(result);
      navigate(result.user.role === "admin" ? "/admin" : "/employee");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="login-shell">
      <section className="login-copy">
        <p className="eyebrow">Employee Task Tracker</p>
        <h1>Run task operations with a clear split between admin control and employee execution.</h1>
        <p>
          Admins can assign and edit work, employees can move their work forward, and both dashboards stay aligned
          through a single API.
        </p>
      </section>

      <form className="login-card" onSubmit={handleSubmit}>
        <h2>Sign in</h2>
        <p className="muted">Use one of the seeded users from the SQL file or register through the API.</p>
        {error ? <div className="alert">{error}</div> : null}
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" value={form.email} onChange={handleChange} required />
        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          required
        />
        <button className="primary-button" disabled={busy} type="submit">
          {busy ? "Logging in..." : "Login"}
        </button>
        <div className="demo-credentials">
          <strong>Demo credentials</strong>
          <span>`admin@example.com` / `Password@123`</span>
          <span>`alice@example.com` / `Password@123`</span>
        </div>
      </form>
    </div>
  );
};
