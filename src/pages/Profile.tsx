import React, { useState, useEffect } from "react";
import Login from "../components/Login";
import Register from "../components/Register";
import Logout from "../components/Logout";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../Profile.css";

type User = {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
};

const Profile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showRegister, setShowRegister] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);
  //some of these aren't used, and was just for experimentation.
  //most likely these were scrapped, but I didn't want to comment them out lmaoo
  const openRegister = () => {
    setShowRegister(true);
  };

  const closeRegister = () => {
    setShowRegister(false);
  };

  const openUpdate = () => {
    setShowUpdate(true);
  };

  const closeUpdate = () => {
    setShowUpdate(false);
  };

  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    newPassword: "",
  });

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

    fetchUpdateAccountInfo();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:3000/api/update-profile",
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const reincarnateButton = document.getElementById("reincarnateButton");
      if (reincarnateButton) {
        reincarnateButton.classList.add("shake");
      }
      toast.success(response.data.message);
      setTimeout(() => {
        closeUpdate();
      }, 2000);
    } catch (error: any) {
      if (error.response && error.response.status === 409) {
        toast.error("Email is already in use");
      } else if (error.response && error.response.status === 400) {
        toast.error(error.response.data.error);
      } else {
        console.error("Update failed:", error);
        toast.error("Update failed. Please try again later.");
      }
    }
  };

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
          <div className="UpdateButton">
            <button onClick={openUpdate}>Update Profile</button>
          </div>

          {showUpdate && (
            <div className={`UpdateForm ${showUpdate ? "open" : ""}`}>
              <form onSubmit={handleSubmit}>
                <label htmlFor="firstname">First Name</label>
                <input
                  id="firstname"
                  name="firstname"
                  type="text"
                  onChange={handleInputChange}
                  value={formData.firstname}
                />
                <label htmlFor="lastname">Last Name</label>
                <input
                  id="lastname"
                  name="lastname"
                  type="text"
                  onChange={handleInputChange}
                  value={formData.lastname}
                />
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  onChange={handleInputChange}
                  value={formData.email}
                />
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  name="newPassword"
                  type="password"
                  onChange={handleInputChange}
                  value={formData.newPassword}
                />
                <button
                  id="reincarnateButton"
                  type="submit"
                  className="reincarButton"
                >
                  Reincarnate
                </button>
              </form>

              <button onClick={closeUpdate}>Close Update Form</button>
            </div>
          )}
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
