import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Navbar.css";

function Navbar() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setLoading(false);
      return;
    }

    axios
      .get("http://localhost:5000/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => {
        setUser(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching user:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="navbar">
      <h3>
        {loading ? "Loading..." : user ? `Welcome, ${user.name}!` : "Loading user..."}
      </h3>
    </div>
  );
}

export default Navbar;
