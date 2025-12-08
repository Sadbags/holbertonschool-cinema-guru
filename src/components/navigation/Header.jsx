import './navigation.css';
import logoutIcon from '../../assets/Frame.png';

function Header({ userUsername, setIsLoggedIn }) {
  const logout = () => {
    // Remove token from localStorage
    localStorage.removeItem('accessToken');
    // Set isLoggedIn to false
    setIsLoggedIn(false);
  };
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <h3 className="navbar-title">Cinema Guru</h3>
      </div>

      <div className="navbar-right">
        <img
          src="https://picsum.photos/100/100"
          alt="User avatar"
          className="navbar-avatar"
        />

        <p className="navbar-welcome">
          Welcome, {userUsername || 'User'}!
        </p>

        <button className="navbar-logout" onClick={logout}>
          <img
            src={logoutIcon}
            alt="Logout"
            className="navbar-logout-icon"
          />
          <span className="navbar-logout-text">Logout</span>
        </button>
      </div>
    </nav>
  );
}

export default Header;