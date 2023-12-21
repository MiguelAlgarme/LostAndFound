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

  useEffect(() => {
    const fetchUpdateAccountInfo = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/update-account",
          {
            withCredentials: true,
          }
        );
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching update account information...", error);
      }
    };

    // Fetch update account information only when the component mounts
    fetchUpdateAccountInfo();
  }, []); // Empty dependency array ensures this runs once when the component mounts

  return (
    <div>
      {user !== null ? (
        <>
          <p>Welcome, {user.firstname}!</p>
          <div className="UserInfo">
            <p>ID number: {user.id}</p>
            <p>Email: {user.email}</p>
            <p>Role: "TO BE ADDED"</p>
          </div>

          <Logout />
        </>
      ) : (
        <>
          <Login setUser={setUser} />
          {showRegister && (
            <div className="B2">
              <p>Account</p>
              <button>
                <Register />
              </button>
            </div>
          )}
          {!showRegister && (
            <div className="B3">
              <button onClick={openRegister}>Sign up</button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Profile;
