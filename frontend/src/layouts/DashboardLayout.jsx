import { useAuth } from "../hooks/useAuth.js";

export const DashboardLayout = ({ title, subtitle, children }) => {
  const { user, logout } = useAuth();

  return (
    <div className="app-shell">
      <header className="hero">
        <div>
          <p className="eyebrow">{user?.role}</p>
          <h1>{title}</h1>
          <p className="hero-copy">{subtitle}</p>
        </div>
        <div className="hero-actions">
          <div className="identity-card">
            <span>{user?.name}</span>
            <small>{user?.email}</small>
          </div>
          <button className="ghost-button" onClick={logout} type="button">
            Logout
          </button>
        </div>
      </header>
      <main className="content-grid">{children}</main>
    </div>
  );
};
