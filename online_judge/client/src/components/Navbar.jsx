import { NavLink, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './Navbar.css';
import ProfileDropdown from './ProfileDropdown';

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [username, setUsername] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('username');
    if (storedUser) {
      setUsername(storedUser);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setUsername(null);
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <NavLink to="/" className="nav-logo">🧠 Saarthi</NavLink>
      </div>

      <div className="navbar-middle">
        <NavLink to="/" className={({ isActive }) => isActive ? 'active' : ''}>Dashboard</NavLink>
        <NavLink to="/submissions" className={({ isActive }) => isActive ? 'active' : ''}>Submissions</NavLink>
        <NavLink to="/leaderboard" className={({ isActive }) => isActive ? 'active' : ''}>Leaderboard</NavLink>
      </div>

      <div className="navbar-right">
        {!username ? (
          <>
            <NavLink to="/login" className={({ isActive }) => isActive ? 'active' : ''}>Login</NavLink>
            <NavLink to="/register" className={({ isActive }) => isActive ? 'active' : ''}>Register</NavLink>
          </>
        ) : (
          <div className="profile-wrapper">
            <div className="profile-icon" onClick={() => setDropdownOpen(!dropdownOpen)}>
              {username.charAt(0).toUpperCase()}
            </div>
            {dropdownOpen && (
              <ProfileDropdown
                username={username}
                onLogout={handleLogout}
              />
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
