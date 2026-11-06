import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { NavLink, useNavigate } from "react-router-dom";

const navigationLinks = [
  ["Home", "/"],
  ["About", "/about"],
  ["Projects", "/projects"],
  ["Education", "/education"],
  ["Services", "/services"],
  ["Contact", "/contact"],
];

export default function Header() {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <header className="site-header">
      <div className="nav-shell">
        <NavLink to="/" className="logo" aria-label="Yuri Koller home">
          <span>YK</span>
        </NavLink>
        <button
          className="menu-button"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation"
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X /> : <Menu />}
        </button>
        <nav
          className={menuOpen ? "nav-links open" : "nav-links"}
          aria-label="Main navigation"
        >
          {navigationLinks.map(([label, path]) => (
            <NavLink
              key={path}
              to={path}
              end={path === "/"}
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </NavLink>
          ))}
          {!loading && (user ? <>
            <NavLink to="/manage" onClick={() => setMenuOpen(false)}>{user.role === 'admin' ? 'Admin' : 'My account'}</NavLink>
            <button className="nav-action" onClick={async () => { try { await signOut(); setMenuOpen(false); navigate('/signin'); } catch (err) { setError(err.message); } }}>Sign out</button>
          </> : <NavLink to="/signin" onClick={() => setMenuOpen(false)}>Sign in</NavLink>)}
        </nav>
      </div>
      {error && <p role="alert">{error}</p>}
    </header>
  );
}
