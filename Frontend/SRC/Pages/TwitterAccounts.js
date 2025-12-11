import React, { useEffect, useState } from "react";
import axios from "axios";
import "./TwitterAccounts.css";

function TwitterAccounts() {
  const [account, setAccount] = useState(null);
  const [tweets, setTweets] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [tweetText, setTweetText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [charCount, setCharCount] = useState(0);

  const token = localStorage.getItem("token");
  const BACKEND_URL = "http://localhost:5000";
  const MAX_CHARS = 280;

  useEffect(() => {
    loadAccount();
    loadTweets();
    loadAnalytics();
  }, []);

  const loadAccount = async () => {
    try {
      setError("");
      setLoading(true);
      const res = await axios.get(`${BACKEND_URL}/api/twitter/accounts`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAccount(res.data);
      setSelectedAccount(res.data);
    } catch (err) {
      setError("Failed to load Twitter account. Make sure Twitter is connected. Open the Accounts page to connect.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadTweets = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/twitter/tweets/stored`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTweets(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const loadAnalytics = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/twitter/analytics`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAnalytics(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleFetchTweets = async () => {
    try {
      setError("");
      setLoading(true);
      await axios.get(`${BACKEND_URL}/api/twitter/tweets`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      loadTweets();
      setSuccessMessage("Tweets fetched successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setError("Failed to fetch tweets");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleTweet = async () => {
    if (!tweetText.trim()) {
      setError("Tweet cannot be empty");
      return;
    }

    if (tweetText.length > MAX_CHARS) {
      setError(`Tweet exceeds ${MAX_CHARS} characters`);
      return;
    }

    try {
      setError("");
      setLoading(true);
      await axios.post(
        `${BACKEND_URL}/api/twitter/tweet`,
        { text: tweetText },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTweetText("");
      setCharCount(0);
      loadTweets();
      loadAnalytics();
      setSuccessMessage("Tweet posted successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setError("Failed to post tweet");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = async () => {
    if (!window.confirm("Are you sure you want to disconnect Twitter?")) return;

    try {
      setError("");
      setLoading(true);
      await axios.post(
        `${BACKEND_URL}/api/twitter/disconnect`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAccount(null);
      setTweets([]);
      setSelectedAccount(null);
      setAnalytics(null);
      setSuccessMessage("Twitter disconnected");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setError("Failed to disconnect");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleTextChange = (e) => {
    const text = e.target.value;
    setTweetText(text);
    setCharCount(text.length);
  };

  return (
    <div style={styles.container}>
      <h2>Twitter/X Account 🐦</h2>

      {successMessage && <p style={styles.success}>{successMessage}</p>}

      {selectedAccount && (
        <div style={styles.accountBanner}>
          <img
            src={selectedAccount.profile_picture_url}
            alt={selectedAccount.username}
            style={styles.profilePic}
          />
          <div>
            <h3>@{selectedAccount.username}</h3>
            <p>{selectedAccount.bio}</p>
            {selectedAccount.verified && <p>✅ Verified</p>}
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

      {analytics && (
        <div style={styles.analyticsGrid}>
          <div style={styles.metricCard}>
            <h4>👥 Followers</h4>
            <p style={styles.metricValue}>{analytics.followers?.toLocaleString()}</p>
          </div>
          <div style={styles.metricCard}>
            <h4>Following</h4>
            <p style={styles.metricValue}>{analytics.following?.toLocaleString()}</p>
          </div>
          <div style={styles.metricCard}>
            <h4>🐦 Tweets</h4>
            <p style={styles.metricValue}>{analytics.tweets?.toLocaleString()}</p>
          </div>
        </div>
      )}

      <div style={styles.tweetComposer}>
        <h3>Compose Tweet</h3>
        <textarea
          value={tweetText}
          onChange={handleTextChange}
          placeholder="What's happening?!"
          style={styles.textarea}
          maxLength={MAX_CHARS}
          disabled={loading || !account}
        />
        <div style={styles.tweetFooter}>
          <span style={charCount > MAX_CHARS * 0.9 ? styles.charCountWarning : styles.charCount}>
            {charCount}/{MAX_CHARS}
          </span>
          <div>
            <button
              onClick={handleFetchTweets}
              style={styles.secondaryButton}
              disabled={loading || !account}
            >
              {loading ? "Loading..." : "Refresh Tweets"}
            </button>
            <button
              onClick={handleTweet}
              style={styles.button}
              disabled={loading || !account || !tweetText.trim() || charCount > MAX_CHARS}
            >
              {loading ? "Posting..." : "Post Tweet"}
            </button>
          </div>
        </div>
      </div>

      <h3>Recent Tweets</h3>
      {tweets.length === 0 ? (
        <p style={styles.noData}>No tweets</p>
      ) : (
        <div style={styles.tweetsList}>
          {tweets.map((tweet) => (
            <div key={tweet.id} style={styles.tweetCard}>
              <p style={styles.tweetText}>{tweet.text}</p>
              <div style={styles.tweetMetrics}>
                <span>❤️ {tweet.likes_count}</span>
                <span>🔄 {tweet.retweets_count}</span>
                <span>💬 {tweet.replies_count}</span>
              </div>
              <small style={styles.tweetTime}>
                {new Date(tweet.created_time).toLocaleDateString()}
              </small>
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
    maxWidth: "900px",
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
  analyticsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
    gap: "15px",
    marginBottom: "20px",
  },
  metricCard: {
    padding: "15px",
    backgroundColor: "#1DA1F2",
    color: "white",
    borderRadius: "8px",
    textAlign: "center",
  },
  metricValue: {
    fontSize: "24px",
    fontWeight: "bold",
    margin: "5px 0",
  },
  tweetComposer: {
    padding: "15px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    marginBottom: "20px",
    backgroundColor: "#fafafa",
  },
  textarea: {
    width: "100%",
    minHeight: "100px",
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "4px",
    fontSize: "14px",
    fontFamily: "Arial, sans-serif",
    resize: "vertical",
  },
  tweetFooter: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "10px",
  },
  charCount: {
    fontSize: "12px",
    color: "#666",
  },
  charCountWarning: {
    fontSize: "12px",
    color: "#ff6b6b",
    fontWeight: "bold",
  },
  button: {
    padding: "10px 20px",
    backgroundColor: "#1DA1F2",
    color: "white",
    border: "none",
    borderRadius: "20px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "bold",
    marginLeft: "10px",
  },
  secondaryButton: {
    padding: "10px 20px",
    backgroundColor: "#e0e0e0",
    color: "#333",
    border: "none",
    borderRadius: "20px",
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
  tweetsList: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    marginTop: "20px",
  },
  tweetCard: {
    padding: "15px",
    backgroundColor: "white",
    border: "1px solid #ddd",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },
  tweetText: {
    margin: "0 0 10px 0",
    fontSize: "15px",
    lineHeight: "1.5",
  },
  tweetMetrics: {
    display: "flex",
    gap: "15px",
    fontSize: "12px",
    color: "#666",
    marginBottom: "5px",
  },
  tweetTime: {
    color: "#999",
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

export default TwitterAccounts;
