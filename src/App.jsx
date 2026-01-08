// src/App.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import Dashboard from "./routes/dashboard/Dashboard";
import Authentication from "./routes/auth/Authentication";


function App() {
  const [isLoggedInBoolean, setIsLoggedInBoolean] = useState(false);
  const [userUsernamestring, setUserUsernamestring] = useState("");

  // URL BE
  const API_BASE_URL = "http://localhost:8000";

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      return;
    }

    axios
      .post(
        `${API_BASE_URL}/api/auth/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      .then((response) => {
        const { username } = response.data;
        setIsLoggedInBoolean(true);
        setUserUsernamestring(username || "");
      })
      .catch((error) => {
        console.error("Erreur d'authentification :", error);
        setIsLoggedInBoolean(false);
        setUserUsernamestring("");
      });
  }, []);

  if (isLoggedInBoolean) {
    return <Dashboard
      userUsername={userUsernamestring}
      setIsLoggedIn={setIsLoggedInBoolean}
      />;
  }

  // return <Authentication />;

  // If not logged in -> show Authentication screen
  return (
    <Authentication
      setIsLoggedIn={setIsLoggedInBoolean}
      setUserUsername={setUserUsernamestring}
    />
  );
}

export default App;