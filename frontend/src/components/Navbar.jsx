import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/useAuth";

export default function Navbar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();

  return (
    <nav className="navbar">
      <Link to="/" className="brand">
        FeedbackLoop
      </Link>

      <div className="nav-links">
        <NavLink to="/">Board</NavLink>

        {isAuthenticated && <NavLink to="/submit">Submit Request</NavLink>}
        
        {isAuthenticated && <NavLink to="/profile">Profile</NavLink>}

        {isAdmin && <NavLink to="/admin">Admin</NavLink>}

        {!isAuthenticated ? (
          <>
            <NavLink to="/login">Login</NavLink>
            <NavLink to="/register">Register</NavLink>
          </>
        ) : (
          <>
            <span className="user-pill">{user?.name || user?.email}</span>
            <button onClick={logout} className="link-button">
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}