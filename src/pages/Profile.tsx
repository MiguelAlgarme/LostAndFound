import React, { useState, useEffect } from "react";
import Login from "../components/Login";
import Register from "../components/Register";
import Logout from "../components/Logout";
import axios from "axios";
import "../Profile.css";
type User = {
  firstname: string;
  lastname: string;
};

export const Profile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showRegister, setShowRegister] = useState(false);

  const openRegister = () => {
    setShowRegister(true);
  };

  const closeRegister = () => {
    setShowRegister(false);
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/profile", {
          withCredentials: true,
        });
        setUser(response.data.user);
      } catch (error) {
        console.error("Error fetching user...", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);
  return (
    <div>
      {user !== null ? (
        <>
          <p>Welcome, {user.firstname}!</p>
          <Logout />
        </>
      ) : (
        <>
          <Login setUser={setUser} />
          {showRegister && (
            <div className="B2">
              <p>Create an Account?</p>
              <button>
                <Register />
              </button>
            </div>
          )}
          {!showRegister && (
            <div className="B3">
              <button onClick={openRegister}>Create an Account?</button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Profile;
