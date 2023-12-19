import React, { useState } from "react";
import axios from "axios";
import "../Logout.css";

const Logout: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      await axios.delete("http://localhost:3000/api/logout", {
        withCredentials: true,
      });
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    }
  };

  return (
    <button
      className={`logout-button ${isLoading ? "loading" : ""}`}
      onClick={handleLogout}
    >
      {isLoading ? <div className="shimmer">Loading...</div> : "Logout"}
    </button>
  );
};

export default Logout;
