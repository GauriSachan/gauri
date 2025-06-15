import { NavLink } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="logo">
        <NavLink to="/" className="nav-logo">OJ</NavLink>
      </div>
      <div>
        <NavLink to="/" className={({ isActive }) => isActive ? 'active' : ''}>Dashboard</NavLink>
        <NavLink to="/login" className={({ isActive }) => isActive ? 'active' : ''}>Login</NavLink>
        <NavLink to="/register" className={({ isActive }) => isActive ? 'active' : ''}>Register</NavLink>
      </div>
    </nav>
  );
};

export default Navbar;
