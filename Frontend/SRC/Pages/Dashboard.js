import React from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Feed from "./Feed";
import Schedule from "./Schedule";
import Analytics from "./Analytics";
import Accounts from "./Accounts";
import FacebookPages from "./FacebookPages";
import FacebookCallback from "./FacebookCallback";
import InstagramAccounts from "./InstagramAccounts";
import TwitterAccounts from "./TwitterAccounts";
import "./Dashboard.css";

function Dashboard() {
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  return (
    <>
      <Sidebar onLogout={handleLogout} />
      <Navbar />

      <div className="page-content">
        <Routes>
          <Route path="/" element={<Feed />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/accounts" element={<Accounts />} />
          <Route path="/facebook/pages" element={<FacebookPages />} />
          <Route path="/facebook/callback" element={<FacebookCallback />} />
          <Route path="/instagram/accounts" element={<InstagramAccounts />} />
          <Route path="/twitter/accounts" element={<TwitterAccounts />} />
        </Routes>
      </div>
    </>
  );
}

export default Dashboard;
