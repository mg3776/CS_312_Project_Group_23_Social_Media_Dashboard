import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Accounts.css";

function Accounts() {
  const token = localStorage.getItem("token");
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const BACKEND_URL = "http://localhost:5000";

  const loadConnections = async () => {
    try {
      setError("");
      setLoading(true);
      const res = await axios.get(`${BACKEND_URL}/api/auth/accounts`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAccounts(res.data || []);
    } catch (err) {
      setError("Failed to load accounts");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConnections();

    try {
      const params = new URLSearchParams(window.location.search);
      const connectedPlatform = params.get('connected');
      if (connectedPlatform) {
        setSuccess(`${connectedPlatform.charAt(0).toUpperCase() + connectedPlatform.slice(1)} connected successfully!`);
        loadConnections();
        setAccounts((prev) => {
          const exists = prev.find((p) => p.platform === connectedPlatform);
          if (exists) {
            return prev.map((p) => (p.platform === connectedPlatform ? { ...p, connected: true } : p));
          }
          return [...prev, { platform: connectedPlatform, connected: true }];
        });
        const url = new URL(window.location.href);
        url.searchParams.delete('connected');
        window.history.replaceState({}, document.title, url.toString());
      }
    } catch (e) {
    }
    const clearTimer = setTimeout(() => setSuccess(""), 4000);
    return () => clearTimeout(clearTimer);
  }, []);

  const [success, setSuccess] = useState("");

  const handleConnect = (platform) => {
    const userToken = localStorage.getItem("token");
    if (!userToken) {
      setError("User not logged in!");
      return;
    }

    window.location.href = `${BACKEND_URL}/api/auth/${platform}/login?token=${userToken}`;
  };

  return (
    <div style={styles.container}>
      <h2>Account Integrations 🔗</h2>

      {success && <p style={styles.success}>{success}</p>}

      <div className="accounts-container">
        {[
          { platform: "facebook", name: "Facebook", icon: "📘" },
          { platform: "instagram", name: "Instagram", icon: "📷" },
          { platform: "twitter", name: "Twitter / X", icon: "🐦" }
        ].map(({ platform, name, icon }) => {
          const connected = accounts.find((acc) => acc.platform === platform)?.connected;

          return (
            <div className="account-card" key={platform}>
              <h3>{icon} {name}</h3>

              <button
                className={connected ? "connected-btn" : "connect-btn"}
                onClick={() => handleConnect(platform)}
                disabled={loading}
                style={styles.button}
              >
                {connected ? "Connected ✔" : "Connect Account"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: "20px",
    maxWidth: "1000px",
    margin: "0 auto",
  },
  error: {
    color: "#fff",
    backgroundColor: "#d32f2f",
    padding: "12px",
    borderRadius: "5px",
    marginBottom: "15px",
  },
  success: {
    color: "#0f5132",
    backgroundColor: "#d1e7dd",
    padding: "12px",
    borderRadius: "5px",
    marginBottom: "15px",
  },
  button: {
    transition: "all 0.3s ease",
  },
};

export default Accounts;
