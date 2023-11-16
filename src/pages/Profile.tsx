import React, { useState, useEffect } from "react";
import Login from "../components/Login";
import Register from "../components/Register";
import Logout from "../components/Logout";
import axios from "axios";

type User = {
  firstname: string;
  lastname: string;
};

export const Profile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

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
          <Register />
        </>
      )}
    </div>
  );
};

export default Profile;
