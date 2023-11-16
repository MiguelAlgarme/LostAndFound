import React from "react";
import axios from "axios";

const Logout = () => {
  const handleLogout = async () => {
    try {
      await axios.delete("http://localhost:3000/api/logout");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
  return <button onClick={handleLogout}>Logout</button>;
};

export default Logout;
