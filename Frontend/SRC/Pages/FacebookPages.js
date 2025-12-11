import React, { useEffect, useState } from "react";
import axios from "axios";
import "./FacebookPages.css";

function FacebookPages() {
  const [pages, setPages] = useState([]);
  const [selectedPage, setSelectedPage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const token = localStorage.getItem("token");
  const BACKEND_URL = "http://localhost:5000";

  useEffect(() => {
    loadPages();
    loadSelectedPage();
  }, []);

  const loadPages = async () => {
    try {
      setError("");
      setLoading(true);
      const res = await axios.get(`${BACKEND_URL}/api/facebook/pages`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPages(res.data || []);
    } catch (err) {
      setError("Failed to load pages. Make sure Facebook is connected. Open the Accounts page to connect.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadSelectedPage = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/facebook/pages/selected`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSelectedPage(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSelectPage = async (pageId) => {
    try {
      setError("");
      setLoading(true);
      await axios.post(
        `${BACKEND_URL}/api/facebook/pages/select`,
        { pageId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccessMessage("Page selected successfully!");
      loadSelectedPage();
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setError("Failed to select page");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = async () => {
    if (!window.confirm("Are you sure you want to disconnect Facebook?")) return;

    try {
      setError("");
      setLoading(true);
      await axios.post(
        `${BACKEND_URL}/api/facebook/disconnect`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPages([]);
      setSelectedPage(null);
      setSuccessMessage("Facebook disconnected");
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
      <h2>Manage Facebook Pages 📘</h2>

      {successMessage && <p style={styles.success}>{successMessage}</p>}

      {selectedPage && (
        <div style={styles.selectedPageBanner}>
          <strong>📌 Currently Managing:</strong> {selectedPage.page_name}
          <button
            onClick={handleDisconnect}
            style={styles.disconnectBtn}
            disabled={loading}
          >
            Disconnect Facebook
          </button>
        </div>
      )}

      {loading && pages.length === 0 ? (
        <p>Loading pages...</p>
      ) : pages.length === 0 ? (
        <p>No pages</p>
      ) : (
        <div style={styles.pagesGrid}>
          {pages.map((page) => (
            <div
              key={page.page_id}
              style={{
                ...styles.pageCard,
                borderColor:
                  selectedPage?.page_id === page.page_id ? "#4db8ff" : "#004080",
                backgroundColor:
                  selectedPage?.page_id === page.page_id ? "#003d66" : "#003366",
              }}
            >
              {page.profile_picture_url && (
                <img
                  src={page.profile_picture_url}
                  alt={page.page_name}
                  style={styles.pagePicture}
                />
              )}
              <h3>{page.page_name}</h3>
              <p>
                <strong>Followers:</strong> {page.followers_count?.toLocaleString() || "N/A"}
              </p>
              <button
                onClick={() => handleSelectPage(page.page_id)}
                style={{
                  ...styles.selectBtn,
                  opacity: loading ? 0.6 : 1,
                  backgroundColor:
                    selectedPage?.page_id === page.page_id ? "#28a745" : "#4db8ff",
                }}
                disabled={loading}
              >
                {selectedPage?.page_id === page.page_id ? "Selected ✓" : "Select Page"}
              </button>
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
  },
  error: {
    color: "#ff6b6b",
    backgroundColor: "#3d1a1a",
    padding: "10px",
    borderRadius: "5px",
    marginBottom: "15px",
    borderLeft: "4px solid #ff6b6b",
  },
  success: {
    color: "#28a745",
    backgroundColor: "#1a3d1a",
    padding: "10px",
    borderRadius: "5px",
    marginBottom: "15px",
    borderLeft: "4px solid #28a745",
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
  selectedPageBanner: {
    backgroundColor: "#004080",
    padding: "15px",
    borderRadius: "8px",
    marginBottom: "20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderLeft: "4px solid #4db8ff",
  },
  disconnectBtn: {
    padding: "8px 15px",
    backgroundColor: "#ff4136",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "bold",
  },
  pagesGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
    gap: "20px",
  },
  pageCard: {
    backgroundColor: "#003366",
    padding: "20px",
    borderRadius: "10px",
    border: "2px solid #004080",
    textAlign: "center",
    transition: "all 0.3s ease",
  },
  pagePicture: {
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    marginBottom: "15px",
  },
  selectBtn: {
    width: "100%",
    padding: "10px",
    backgroundColor: "#4db8ff",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontWeight: "bold",
    marginTop: "10px",
    transition: "all 0.3s ease",
  },
};

export default FacebookPages;
