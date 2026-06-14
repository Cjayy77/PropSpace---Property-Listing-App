import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : user?.username?.[0]?.toUpperCase() ?? '?';

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">PropSpace</Link>
      <div className="navbar-links">
        <Link to="/">Browse</Link>
        {user ? (
          <>
            <Link to="/watchlist">Watchlist</Link>
            <Link to="/dashboard">My Listings</Link>
            <Link to="/properties/new">List Property</Link>
            <Link to="/profile" title={user.username} aria-label="Profile">
              <div className="navbar-avatar">{initials}</div>
            </Link>
            <button onClick={handleLogout} className="btn-link">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register" className="btn-primary-sm">Get Started</Link>
          </>
        )}
      </div>
    </nav>
  );
}
