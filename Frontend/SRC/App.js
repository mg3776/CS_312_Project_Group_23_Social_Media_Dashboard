import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

function App() {
  const [isLogged, setIsLogged] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLogged(!!token);
  }, []);

  if (!isLogged) {
    if (showRegister) {
      return <Register onSwitch={() => setShowRegister(false)} />;
    }
    return (
      <Login 
        onLogin={() => setIsLogged(true)} 
        onSwitchToRegister={() => setShowRegister(true)}
      />
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/*" element={<Dashboard />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
