import './ProfileDropdown.css';

export default function ProfileDropdown({ username, onLogout }) {
  return (
    <div className="profile-dropdown">
      <p>👤 {username}</p>
      <button onClick={onLogout}>Logout</button>
    </div>
  );
}
