import { useState } from "react";
import "./auth.css";
import axios from "axios";
import Login from "./Login";
import Register from "./Register";

const API_BASE_URL = "http://localhost:8000";

function Authentication({ setIsLoggedIn, setUserUsername }) {
  const [_switchBoolean, setSwitchBoolean] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSignInClick = () => setSwitchBoolean(true);
  const handleSignUpClick = () => setSwitchBoolean(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const endpoint = _switchBoolean
        ? "/api/auth/login"
        : "/api/auth/register";

      const response = await axios.post(
        `${API_BASE_URL}${endpoint}`,
        { username, password }
      );

      const accessToken = response.data.accessToken;
      if (accessToken) {
        localStorage.setItem("accessToken", accessToken);
      }

      setUserUsername(username);
      setIsLoggedIn(true);

    } catch (error) {
      console.error(
        "Authentication error:",
        error.response?.data || error.message
      );
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-card" onSubmit={handleSubmit}>
        <div className="auth-tabs">
          <button
            type="button"
            className={`auth-tab ${_switchBoolean ? "active" : ""}`}
            onClick={handleSignInClick}
          >
            Sign In
          </button>

          <button
            type="button"
            className={`auth-tab ${!_switchBoolean ? "active" : ""}`}
            onClick={handleSignUpClick}
          >
            Sign Up
          </button>
        </div>

        {_switchBoolean ? (
          <Login
            username={username}
            password={password}
            setUsername={setUsername}
            setPassword={setPassword}
          />
        ) : (
          <Register
            username={username}
            password={password}
            setUsername={setUsername}
            setPassword={setPassword}
          />
        )}

        {/* Botón dentro del formulario padre */}
        <div className="auth-actions">
          <button type="submit" className="auth-submit">
            {_switchBoolean ? "Sign In" : "Sign Up"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default Authentication;
