import React from "react";
import { Link } from "react-router-dom";
import { FaHome, FaCalendarAlt, FaChartBar, FaSignOutAlt, FaUser, FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";
import "./Sidebar.css";

function Sidebar({ onLogout }) {
  return (
    <div className="sidebar">
      <h2>SocialDash</h2>

      <ul>
        <li>
          <Link to="/">
            <FaHome /> Activity Feed
          </Link>
        </li>

        <li>
          <Link to="/schedule">
            <FaCalendarAlt /> Scheduling
          </Link>
        </li>

        <li>
          <Link to="/analytics">
            <FaChartBar /> Analytics
          </Link>
        </li>

        <li>
          <Link to="/accounts">
            <FaUser /> Accounts
          </Link>
        </li>

        <li>
          <Link to="/facebook/pages">
            <FaFacebook /> Facebook Pages
          </Link>
        </li>

        <li>
          <Link to="/instagram/accounts">
            <FaInstagram /> Instagram
          </Link>
        </li>

        <li>
          <Link to="/twitter/accounts">
            <FaTwitter /> Twitter
          </Link>
        </li>
      </ul>

      

      <button className="logout-btn" onClick={onLogout}>
        <FaSignOutAlt /> Logout
      </button>
    </div>
  );
}

export default Sidebar;
