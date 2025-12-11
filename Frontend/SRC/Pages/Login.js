import React, { useState } from "react";
import axios from "axios";

function Login({ onLogin, onSwitchToRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    
    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });
      localStorage.setItem("token", res.data.token);
      onLogin();
    } catch (error) {
      setError(error.response?.data?.error || "Login failed");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.box}>
        <h1 style={styles.title}>SocialDash</h1>
        <h2 style={styles.subtitle}>Login</h2>
        {error && <p style={styles.error}>{error}</p>}
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
          />
          <br />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
          />
          <br />
          <button type="submit" style={styles.button}>
            Login
          </button>
        </form>
        <p style={styles.switchText}>
          Don't have an account?{" "}
          <button
            type="button"
            onClick={onSwitchToRegister}
            style={styles.linkButton}
          >
            Register here
          </button>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    background: "var(--bg)",
  },
  box: {
    background: "var(--card)",
    padding: "40px",
    borderRadius: "10px",
    boxShadow: "0 8px 16px rgba(0, 0, 0, 0.3)",
    width: "100%",
    maxWidth: "400px",
    border: "1px solid rgba(77, 184, 255, 0.2)",
  },
  title: {
    color: "var(--accent)",
    textAlign: "center",
    margin: "0 0 10px 0",
    fontSize: "28px",
    fontWeight: "bold",
  },
  subtitle: {
    color: "var(--text)",
    textAlign: "center",
    marginTop: "0",
    marginBottom: "20px",
  },
  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "15px",
    border: "1px solid rgba(77, 184, 255, 0.3)",
    borderRadius: "5px",
    boxSizing: "border-box",
    fontSize: "14px",
    backgroundColor: "rgba(0, 20, 39, 0.5)",
    color: "var(--text)",
  },
  button: {
    width: "100%",
    padding: "10px",
    background: "var(--accent)",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "bold",
    marginTop: "10px",
    transition: "all 0.3s ease",
  },
  error: {
    color: "#ff6b6b",
    marginBottom: "15px",
    padding: "10px",
    background: "rgba(255, 107, 107, 0.1)",
    borderRadius: "5px",
    border: "1px solid #ff6b6b",
  },
  switchText: {
    marginTop: "20px",
    textAlign: "center",
    color: "var(--muted)",
  },
  linkButton: {
    background: "none",
    border: "none",
    color: "var(--accent)",
    cursor: "pointer",
    textDecoration: "underline",
    fontSize: "14px",
  },
};

export default Login;
