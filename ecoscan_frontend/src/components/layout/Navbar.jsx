import { NavLink } from "react-router-dom";

function Navbar() {
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
        <NavItem to="/about">About</NavItem>
      </nav>
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