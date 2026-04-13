import { useState } from "react";
import { useAuth } from "./AuthContext";
import { Login, Register } from "./Auth";
import Dashboard from "./Dashboard";
import "./App.css";

export default function App() {
  console.log("App component rendering...");

  const { user, logout, isAuthenticated, loading } = useAuth();
  const [showRegister, setShowRegister] = useState(false);

  console.log("Auth state:", { user, isAuthenticated, loading });

  if (loading) {
    return (
      <div style={{ textAlign: "center", paddingTop: "50px" }}>
        <p>Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return showRegister ? (
      <Register onSwitch={() => setShowRegister(false)} />
    ) : (
      <Login onSwitch={() => setShowRegister(true)} />
    );
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-content">
          <h1>📚 LegalEase AI</h1>
          <div className="header-right">
            <span className="user-info">Welcome, {user?.name}!</span>
            <button onClick={logout} className="logout-button">
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="app-main">
        <Dashboard />
      </main>
    </div>
  );
}