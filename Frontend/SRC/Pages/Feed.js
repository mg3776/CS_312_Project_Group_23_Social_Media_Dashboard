import React, { useEffect, useState } from "react";
import axios from "axios";

function Feed() {
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  const loadPosts = async () => {
    try {
      setError("");
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/auth/posts", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(res.data || []);
    } catch (err) {
      setError("Failed to load posts");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const handlePost = async (e) => {
    e.preventDefault();
    
    if (!content.trim()) {
      setError("Post content cannot be empty");
      return;
    }

    try {
      setError("");
      setLoading(true);
      await axios.post(
        "http://localhost:5000/api/auth/post",
        { content },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setContent("");
      await loadPosts();
    } catch (err) {
      setError("Failed to create post");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2>Activity Feed 🚀</h2>

      <form onSubmit={handlePost} style={styles.form}>
        <textarea
          placeholder="Share an update..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          style={styles.textarea}
        />
        <button type="submit" style={styles.submitBtn} disabled={loading}>
          {loading ? "Posting..." : "Post"}
        </button>
      </form>

      <div style={styles.postsList}>
        {loading && posts.length === 0 ? (
          <p>Loading posts...</p>
        ) : posts.length === 0 ? (
          <p>No posts yet. Be the first to share!</p>
        ) : (
          posts.map((post) => (
            <div key={post.id} style={styles.postCard}>
              <div style={styles.postHeader}>
                <strong style={styles.userName}>{post.name}</strong>
                <small style={styles.timestamp}>
                  {new Date(post.created_at).toLocaleString()}
                </small>
              </div>
              <p style={styles.postContent}>{post.content}</p>
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
  postsList: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  postCard: {
    backgroundColor: "#003366",
    padding: "15px",
    borderRadius: "8px",
    borderLeft: "4px solid #4db8ff",
  },
  postHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "10px",
  },
  userName: {
    color: "#4db8ff",
    fontSize: "16px",
  },
  timestamp: {
    color: "#aaa",
    fontSize: "12px",
  },
  postContent: {
    color: "#fff",
    margin: "10px 0 0 0",
    lineHeight: "1.5",
  },
  error: {
    color: "#ff6b6b",
    backgroundColor: "#3d1a1a",
    padding: "10px",
    borderRadius: "5px",
    marginBottom: "15px",
  },
};

export default Feed;
