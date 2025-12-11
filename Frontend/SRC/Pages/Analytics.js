import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart, Line,
  CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar
} from "recharts";
import "./Analytics.css";

function Analytics() {
  const [data, setData] = useState([]);
  const [facebookData, setFacebookData] = useState([]);
  const [selectedMetric, setSelectedMetric] = useState('page_fans');
  const [dateRange, setDateRange] = useState(30);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");
  const BACKEND_URL = "http://localhost:5000";

  useEffect(() => {
    fetchAnalytics();
    fetchFacebookInsights();
  }, [dateRange, selectedMetric]);

  const fetchAnalytics = async () => {
    try {
      setError("");
      setLoading(true);
      const res = await axios.get(`http://localhost:5000/api/auth/analytics?days=${dateRange}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setData(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchFacebookInsights = async () => {
    try {
      setError("");
      const res = await axios.get(
        `${BACKEND_URL}/api/facebook/insights/stored`,
        {
          params: {
            metric: selectedMetric,
            days: dateRange
          },
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      const transformedData = (res.data || []).map(item => ({
        date: new Date(item.insight_date).toLocaleDateString(),
        value: item.metric_value,
        fullDate: item.insight_date
      }));
      
      setFacebookData(transformedData);
    } catch (err) {
      if (err.response?.status !== 400) {
        console.error(err);
      }
    } finally {
      setLoading(false);
    }
  };

  const metricLabels = {
    page_fans: 'Followers',
    page_engaged_users: 'Engaged Users',
    page_post_engagements: 'Post Engagements',
    page_impressions: 'Impressions',
    page_views: 'Page Views'
  };

  return (
    <div style={styles.container}>
      <h2>Analytics 📊</h2>

      <div style={styles.chartContainer}>
        <h3 style={styles.chartTitle}>Dashboard Analytics - Follower Growth</h3>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <Line 
              type="monotone" 
              dataKey="followers" 
              stroke="var(--accent)" 
              strokeWidth={3}
              dot={{ fill: "var(--accent)", r: 5 }}
            />
            <CartesianGrid stroke="#555" />
            <XAxis dataKey="day" stroke="#fff" />
            <YAxis stroke="#fff" />
            <Tooltip 
              contentStyle={{ background: "#001a39", border: "1px solid #4db8ff" }}
              labelStyle={{ color: "#fff" }}
            />
            <Legend />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div style={styles.chartContainer}>
        <h3 style={styles.chartTitle}>Dashboard Analytics - Engagement</h3>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <Line 
              type="monotone" 
              dataKey="engagement" 
              stroke="var(--accent-2)" 
              strokeWidth={3}
              dot={{ fill: "var(--accent-2)", r: 5 }}
            />
            <CartesianGrid stroke="#555" />
            <XAxis dataKey="day" stroke="#fff" />
            <YAxis stroke="#fff" />
            <Tooltip 
              contentStyle={{ background: "#001a39", border: "1px solid var(--accent-2)" }}
              labelStyle={{ color: "#fff" }}
            />
            <Legend />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div style={styles.facebookSection}>
        <h3 style={styles.chartTitle}>📘 Facebook Page Insights</h3>
        
        <div style={styles.controlsContainer}>
          <div style={styles.controlGroup}>
            <label style={styles.label}>Metric:</label>
            <select
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value)}
              style={styles.select}
            >
              {Object.entries(metricLabels).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div style={styles.controlGroup}>
            <label style={styles.label}>Date Range:</label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(Number(e.target.value))}
              style={styles.select}
            >
              <option value={7}>Last 7 days</option>
              <option value={30}>Last 30 days</option>
              <option value={90}>Last 90 days</option>
            </select>
          </div>
        </div>

        {loading ? (
          <p>Loading insights...</p>
        ) : facebookData.length === 0 ? (
          <p style={styles.noData}>No data</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={facebookData}>
              <Bar dataKey="value" fill="#4db8ff" />
              <CartesianGrid stroke="#555" />
              <XAxis dataKey="date" stroke="#fff" angle={-45} textAnchor="end" height={80} />
              <YAxis stroke="#fff" />
              <Tooltip 
                contentStyle={{ background: "#001a39", border: "1px solid #4db8ff" }}
                labelStyle={{ color: "#fff" }}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: "20px",
  },
  chartContainer: {
    padding: "20px",
    backgroundColor: "var(--card)",
    borderRadius: "10px",
    marginBottom: "30px",
    border: "1px solid rgba(255,255,255,0.04)",
  },
  facebookSection: {
    padding: "20px",
    backgroundColor: "var(--card)",
    borderRadius: "10px",
    marginBottom: "30px",
    border: "1px solid rgba(255,255,255,0.04)",
  },
  chartTitle: {
    color: "var(--accent)",
    marginTop: 0,
    marginBottom: "20px",
  },
  error: {
    color: "#ff6b6b",
    backgroundColor: "rgba(255,107,107,0.08)",
    padding: "10px",
    borderRadius: "5px",
    marginBottom: "15px",
  },
  noData: {
    color: "var(--muted)",
    fontStyle: "italic",
    padding: "20px",
    textAlign: "center",
  },
  controlsContainer: {
    display: "flex",
    gap: "20px",
    marginBottom: "20px",
  },
  controlGroup: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  label: {
    color: "#fff",
    fontWeight: "bold",
  },
  select: {
    padding: "8px 12px",
    backgroundColor: "var(--bg)",
    color: "var(--text)",
    border: "1px solid rgba(255,255,255,0.04)",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "14px",
  },
};

export default Analytics;
