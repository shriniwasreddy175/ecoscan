import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

function Navbar({ theme, onToggleTheme }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="topbar">
      <div className="brand">
        <span className="brand-dot" />
        <div>
          <strong>EcoScan</strong>
          <small>Sustainability Intelligence</small>
        </div>
      </div>

      <nav className="nav-links">
        <NavItem to="/">Home</NavItem>
        <NavItem to="/analyzer">Analyzer</NavItem>
        <NavItem to="/scan">Scan</NavItem>
        <NavItem to="/compare">Compare</NavItem>
        <NavItem to="/gamification">Rewards</NavItem>
        {user && <NavItem to="/leaderboard">Leaderboard</NavItem>}
        <NavItem to="/about">About</NavItem>
      </nav>

      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <button className="theme-toggle" type="button" onClick={onToggleTheme}>
          {theme === "light" ? "🌙 Dark" : "☀️ Light"}
        </button>

        {user ? (
          <>
            <button className="btn btn-ghost" onClick={() => navigate("/profile")}>
              {user.fullName ?? user.email}
            </button>
            <button className="btn btn-ghost" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <NavLink to="/login" className="nav-link">Login</NavLink>
            <NavLink to="/signup" className="nav-link">Sign up</NavLink>
          </>
        )}
      </div>
    </header>
  );
}

function NavItem({ to, children }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
      end={to === "/"}
    >
      {children}
    </NavLink>
  );
}

export default Navbar;