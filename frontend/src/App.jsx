<<<<<<< HEAD
import { useState, useEffect } from "react";

export default function App() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log("Count changed!");
  }, [count]);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Counter App</h2>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increase
      </button>
=======
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
    console.log("Showing loading...");
    return (
      <div style={{ textAlign: "center", paddingTop: "50px" }}>
        <p>Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    console.log("Showing auth forms...");
    return showRegister ? (
      <Register onSwitch={() => setShowRegister(false)} />
    ) : (
      <Login onSwitch={() => setShowRegister(true)} />
    );
  }

  console.log("Showing dashboard...");
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
>>>>>>> 87e4da6 (initial commit)
    </div>
  );
}