import React, { useState, useEffect } from "react";
import axios from "axios";

function Schedule() {
  const [content, setContent] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const token = localStorage.getItem("token");
  const BACKEND_URL = "http://localhost:5000";

  const loadSchedules = async () => {
    try {
      setError("");
      setLoading(true);
      const res = await axios.get(`${BACKEND_URL}/api/auth/schedules`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSchedules(res.data || []);
    } catch (err) {
      setError("Failed to load scheduled posts");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSchedules();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!content.trim() || !scheduledTime) {
      setError("Both content and scheduled time are required");
      return;
    }

    try {
      setError("");
      setLoading(true);
      await axios.post(
        `${BACKEND_URL}/api/auth/schedule`,
        {
          content,
          scheduled_time: scheduledTime,
          mediaUrl: mediaUrl || null,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSuccessMessage("Post scheduled successfully!");
      setContent("");
      setScheduledTime("");
      setMediaUrl("");
      setTimeout(() => setSuccessMessage(""), 3000);
      await loadSchedules();
    } catch (err) {
      setError("Failed to schedule post");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const publishPost = async (postId) => {
    try {
      setError("");
      setLoading(true);
      await axios.post(
        `${BACKEND_URL}/api/facebook/publish`,
        { postId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccessMessage("Post published to Facebook!");
      setTimeout(() => setSuccessMessage(""), 3000);
      await loadSchedules();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to publish post");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2>Scheduling 📅</h2>

      {successMessage && <p style={styles.success}>{successMessage}</p>}

      <form onSubmit={handleSubmit} style={styles.form}>
        <textarea
          placeholder="Post content..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          style={styles.textarea}
        />
        <input
          type="datetime-local"
          value={scheduledTime}
          onChange={(e) => setScheduledTime(e.target.value)}
          style={styles.input}
        />
        <input
          type="url"
          placeholder="Media URL (optional)"
          value={mediaUrl}
          onChange={(e) => setMediaUrl(e.target.value)}
          style={styles.input}
        />
        <button type="submit" style={styles.submitBtn} disabled={loading}>
          {loading ? "Scheduling..." : "Schedule Post"}
        </button>
      </form>

      <h3>Upcoming Scheduled Posts</h3>

      <div style={styles.schedulesList}>
        {loading && schedules.length === 0 ? (
          <p>Loading schedules...</p>
        ) : schedules.length === 0 ? (
          <p>No scheduled posts yet.</p>
        ) : (
          schedules.map((item) => (
            <div key={item.id} style={styles.scheduleCard}>
              <div style={styles.scheduleHeader}>
                <div>
                  <p style={styles.scheduleContent}>
                    <strong>Content:</strong> {item.content}
                  </p>
                  {item.media_url && (
                    <p style={styles.mediaUrl}>
                      <strong>Media:</strong> <a href={item.media_url} target="_blank" rel="noopener noreferrer">{item.media_url}</a>
                    </p>
                  )}
                  <small style={styles.scheduleTime}>
                    Scheduled for: {new Date(item.scheduled_time).toLocaleString()}
                  </small>
                </div>
                <div style={styles.statusBadge}>
                  {item.status === 'published' ? '✓ Published' : '⏳ Pending'}
                </div>
              </div>
              {item.status === 'pending' && (
                <button
                  onClick={() => publishPost(item.id)}
                  style={styles.publishBtn}
                  disabled={loading}
                >
                  Publish Now
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: "20px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    marginBottom: "30px",
    backgroundColor: "#003366",
    padding: "15px",
    borderRadius: "8px",
  },
  textarea: {
    width: "100%",
    minHeight: "80px",
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #004080",
    backgroundColor: "#001a39",
    color: "#fff",
    fontSize: "14px",
    fontFamily: "Arial, sans-serif",
    boxSizing: "border-box",
  },
  input: {
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid rgba(77, 184, 255, 0.3)",
    backgroundColor: "rgba(0, 20, 39, 0.5)",
    color: "var(--text)",
    fontSize: "14px",
    boxSizing: "border-box",
  },
  submitBtn: {
    padding: "10px 20px",
    backgroundColor: "#4db8ff",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "bold",
  },
  schedulesList: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  scheduleCard: {
    marginTop: "15px",
    backgroundColor: "#003366",
    padding: "15px",
    borderRadius: "8px",
    borderLeft: "4px solid #ffcc00",
  },
  scheduleHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "20px",
  },
  scheduleContent: {
    color: "#fff",
    margin: "0 0 10px 0",
  },
  mediaUrl: {
    color: "#4db8ff",
    margin: "0 0 10px 0",
    fontSize: "14px",
  },
  scheduleTime: {
    color: "#aaa",
    fontSize: "12px",
  },
  statusBadge: {
    backgroundColor: "#004080",
    color: "#4db8ff",
    padding: "5px 10px",
    borderRadius: "5px",
    fontSize: "12px",
    fontWeight: "bold",
    whiteSpace: "nowrap",
  },
  publishBtn: {
    marginTop: "10px",
    padding: "8px 15px",
    backgroundColor: "#28a745",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "bold",
  },
  error: {
    color: "#ff6b6b",
    backgroundColor: "#3d1a1a",
    padding: "10px",
    borderRadius: "5px",
    marginBottom: "15px",
  },
  success: {
    color: "#28a745",
    backgroundColor: "#1a3d1a",
    padding: "10px",
    borderRadius: "5px",
    marginBottom: "15px",
  },
};

export default Schedule;
