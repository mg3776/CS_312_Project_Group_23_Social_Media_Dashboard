import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function FacebookCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/accounts");
  }, [navigate]);

  return <h2>Connecting Facebook...</h2>;
}

export default FacebookCallback;
