import React, { useEffect, useState } from "react";
import axios from "axios";
import "./InstagramAccounts.css";

function InstagramAccounts() {
  const [account, setAccount] = useState(null);
  const [media, setMedia] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const token = localStorage.getItem("token");
  const BACKEND_URL = "http://localhost:5000";

  useEffect(() => {
    loadAccount();
    loadMedia();
  }, []);

  const loadAccount = async () => {
    try {
      setError("");
      setLoading(true);
      const res = await axios.get(`${BACKEND_URL}/api/instagram/accounts`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAccount(res.data);
      setSelectedAccount(res.data);
    } catch (err) {
      setError("Failed to load Instagram account. Make sure Instagram is connected. Open the Accounts page to connect.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadMedia = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/instagram/media/stored`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMedia(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleFetchMedia = async () => {
    try {
      setError("");
      setLoading(true);
      await axios.get(`${BACKEND_URL}/api/instagram/media`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      loadMedia();
      setSuccessMessage("Media fetched successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setError("Failed to fetch media");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = async () => {
    if (!window.confirm("Are you sure you want to disconnect Instagram?")) return;

    try {
      setError("");
      setLoading(true);
      await axios.post(
        `${BACKEND_URL}/api/instagram/disconnect`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAccount(null);
      setMedia([]);
      setSelectedAccount(null);
      setSuccessMessage("Instagram disconnected");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setError("Failed to disconnect");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2>Instagram Account 📷</h2>

      {successMessage && <p style={styles.success}>{successMessage}</p>}

      {selectedAccount && (
        <div style={styles.accountBanner}>
          <img
            src={selectedAccount.profile_picture_url}
            alt={selectedAccount.username}
            style={styles.profilePic}
          />
          <div>
            <h3>{selectedAccount.username}</h3>
            <p>{selectedAccount.bio}</p>
            <p>👥 Followers: {selectedAccount.followers_count}</p>
          </div>
          <button
            onClick={handleDisconnect}
            style={styles.disconnectBtn}
            disabled={loading}
          >
            Disconnect
          </button>
        </div>
      )}

      <div style={styles.actionsBar}>
        <button
          onClick={handleFetchMedia}
          style={styles.button}
          disabled={loading || !account}
        >
          {loading ? "Loading..." : "Fetch Latest Media"}
        </button>
      </div>

      <h3>Recent Posts</h3>
      {media.length === 0 ? (
        <p style={styles.noData}>No posts</p>
      ) : (
        <div style={styles.mediaGrid}>
          {media.map((item) => (
            <div key={item.id} style={styles.mediaCard}>
              <img
                src={item.media_url}
                alt={item.caption}
                style={styles.mediaImage}
              />
              <div style={styles.mediaInfo}>
                <p style={styles.caption}>{item.caption}</p>
                <div style={styles.metrics}>
                  <span>❤️ {item.likes_count}</span>
                  <span>💬 {item.comments_count}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: "20px",
    maxWidth: "1200px",
    margin: "0 auto",
  },
  accountBanner: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
    padding: "15px",
    backgroundColor: "#f0f0f0",
    borderRadius: "8px",
    marginBottom: "20px",
  },
  profilePic: {
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    objectFit: "cover",
  },
  actionsBar: {
    display: "flex",
    gap: "10px",
    marginBottom: "20px",
  },
  button: {
    padding: "10px 20px",
    backgroundColor: "#E1306C",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px",
  },
  disconnectBtn: {
    padding: "10px 20px",
    backgroundColor: "#dc3545",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    marginLeft: "auto",
  },
  mediaGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
    gap: "15px",
    marginTop: "20px",
  },
  mediaCard: {
    backgroundColor: "white",
    borderRadius: "8px",
    overflow: "hidden",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    transition: "transform 0.2s",
  },
  mediaImage: {
    width: "100%",
    height: "250px",
    objectFit: "cover",
  },
  mediaInfo: {
    padding: "10px",
  },
  caption: {
    fontSize: "12px",
    marginBottom: "8px",
    color: "#333",
  },
  metrics: {
    display: "flex",
    gap: "10px",
    fontSize: "12px",
    color: "#666",
  },
  error: {
    color: "#d32f2f",
    padding: "10px",
    backgroundColor: "#ffebee",
    borderRadius: "4px",
    marginBottom: "15px",
  },
  success: {
    color: "#388e3c",
    padding: "10px",
    backgroundColor: "#e8f5e9",
    borderRadius: "4px",
    marginBottom: "15px",
  },
  linkBtn: {
    marginTop: "10px",
    padding: "8px 12px",
    backgroundColor: "#4db8ff",
    color: "#003049",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  noData: {
    textAlign: "center",
    color: "#999",
    padding: "20px",
  },
};

export default InstagramAccounts;
