import React, { useEffect, useState } from "react";
import axios from "axios";
import List from "../components/List";

import "../About.css";

interface User {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  role: boolean;
}

export default function About() {
  const [user, setUser] = useState<User | null>(null);
  const [deleteInput, setDeleteInput] = useState("");
  const [userId, setUserId] = useState<string | null>(null); // Add userId state

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/profile", {
          withCredentials: true,
        });
        const userData = response.data.user;
        setUser(userData);
        setUserId(userData?.id || null); // Set userId in the state
      } catch (error) {
        console.error("Error fetching user...", error);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    document.title = "WANDERLOST";
  }, []);

  const handleLogout = async () => {
    try {
      await axios.delete("http://localhost:3000/api/logout", {
        withCredentials: true,
      });

      window.location.href = "/Home";
    } catch (error) {
      console.error("Error logging out...", error);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteInput === "Goodbye Cruel World!" && userId) {
      console.log("Deleting account for user ID:", userId);
      try {
        const response = await axios.delete(
          'http://localhost:3000/api/delete-account/${userId}',
          {
            withCredentials: true,
          }
        );

        if (response.data.message === "Account deleted successfully") {
          console.log("ACCOUNT DELETED!");
        } else {
          console.error("Error deleting account:", response.data.error);
        }
      } catch (error) {
        console.error("Error deleting account...", error);
        console.error("Full Error Object:", error);
      }
    } else {
      alert("Uhh...You ok?");
    }
  };

  const handleDestroySessions = async () => {
    try {
      await axios.delete("http://localhost:3000/api/destroy-sessions", {
        withCredentials: true,
      });

      console.log("All sessions destroyed successfully");
    } catch (error) {
      console.error("Error destroying sessions:", error);
    }
  };

  return (
    <>
      <h1>ABOUT US</h1>
      <p>
        Wanderlost is a website created by <b>Miguel Algarme</b> and{" "}
        <b>Bryce Co</b>, to help students <br /> or anyone to find whatever they
        have lost in the campus <br /> or potential thieves heh
      </p>
      {user && user.role && (
        <>
          <p>
            Hello {user.firstname}, you have admin privileges! <br /> Don't go
            too crazy now
          </p>
          <List />
          <button className="ButtonOfSessions" onClick={handleDestroySessions}>
            Destroy All Sessions
          </button>
        </>
      )}
      <div>
        <p>Type "Goodbye Cruel World!" to delete your account:</p>
        <input
          type="text"
          value={deleteInput}
          onChange={(e) => setDeleteInput(e.target.value)}
        />
        <button className="ButtonOfDeath" onClick={handleDeleteAccount}>
          Delete Account
        </button>
        <p>
          <b>
            Be absolutely sure, once you click the button and no error is shown
            <br />
            The account is already gone to the aether
          </b>
        </p>
      </div>
    </>
  );
}