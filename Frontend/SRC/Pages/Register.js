import React, { useState } from "react";
import axios from "axios";

function Register({ onSwitch }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (!name || !email || !password) {
      setError("All fields are required");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/auth/register", {
        name,
        email,
        password,
      });
      alert("Success! Now login.");
      onSwitch();
    } catch (error) {
      setError(error.response?.data?.error || "Registration failed");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.box}>
        <h1 style={styles.title}>SocialDash</h1>
        <h2 style={styles.subtitle}>Register</h2>
        {error && <p style={styles.error}>{error}</p>}
        <form onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={styles.input}
          />
          <br />
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
            Sign Up
          </button>
        </form>
        <p style={styles.switchText}>
          Already have an account?{" "}
          <button
            type="button"
            onClick={onSwitch}
            style={styles.linkButton}
          >
            Login here
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

export default Register;
