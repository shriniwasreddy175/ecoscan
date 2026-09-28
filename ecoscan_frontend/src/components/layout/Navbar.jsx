import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

function Navbar({ theme, onToggleTheme }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
    setIsMenuOpen(false);
  };

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="topbar">
      <div className="brand">
        <span className="brand-dot" />
        <div>
          <strong>EcoScan</strong>
          <small>Sustainability Intelligence</small>
        </div>
      </div>

      <button
        className="menu-toggle"
        type="button"
        aria-expanded={isMenuOpen}
        aria-controls="primary-navigation"
        onClick={() => setIsMenuOpen(open => !open)}
      >
        <span className="menu-toggle-icon" aria-hidden="true">{isMenuOpen ? "×" : "☰"}</span>
        <span>{isMenuOpen ? "Close" : "Menu"}</span>
      </button>

      <nav id="primary-navigation" className={`nav-links ${isMenuOpen ? "is-open" : ""}`}>
        <NavItem to="/" onClick={closeMenu}>Home</NavItem>
        <NavItem to="/analyzer" onClick={closeMenu}>Analyzer</NavItem>
        <NavItem to="/scan" onClick={closeMenu}>Scan</NavItem>
        <NavItem to="/compare" onClick={closeMenu}>Compare</NavItem>
        <NavItem to="/gamification" onClick={closeMenu}>Rewards</NavItem>
        {user && <NavItem to="/leaderboard" onClick={closeMenu}>Leaderboard</NavItem>}
        <NavItem to="/about" onClick={closeMenu}>About</NavItem>
      </nav>

      <div className={`account-actions ${isMenuOpen ? "is-open" : ""}`}>
        <button className="theme-toggle" type="button" onClick={onToggleTheme}>
          {theme === "light" ? "🌙 Dark" : "☀️ Light"}
        </button>

        {user ? (
          <>
            <button className="btn btn-ghost" onClick={() => { navigate("/profile"); closeMenu(); }}>
              {user.fullName ?? user.email}
            </button>
            <button className="btn btn-ghost" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <NavLink to="/login" className="nav-link" onClick={closeMenu}>Login</NavLink>
            <NavLink to="/signup" className="nav-link" onClick={closeMenu}>Sign up</NavLink>
          </>
        )}
      </div>
    </header>
  );
}

function NavItem({ to, children, onClick }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
      end={to === "/"}
      onClick={onClick}
    >
      {children}
    </NavLink>
  );
}

export default Navbar;