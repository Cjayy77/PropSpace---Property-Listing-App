import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">PropSpace</Link>
      <div className="navbar-links">
        <Link to="/">Browse</Link>
        {user ? (
          <>
            <Link to="/dashboard">My Listings</Link>
            <Link to="/properties/new">+ List Property</Link>
            <Link to="/profile">Profile</Link>
            <button onClick={handleLogout} className="btn-link">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register" className="btn-primary-sm">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
