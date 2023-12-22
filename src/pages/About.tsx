import React, { useEffect, useState } from "react";
import axios from "axios";
import List from "../components/List";

interface User {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  role: boolean;
}

export default function About() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/profile", {
          withCredentials: true,
        });
        setUser(response.data.user);
      } catch (error) {
        console.error("Error fetching user...", error);
      }
    };

    fetchUser();
  }, []);

  return (
    <>
      <h1>ABOUT US</h1>
      <p>
        Wanderlost is a website created by <b>Miguel Algarme</b> and{" "}
        <b>Bryce Co</b>, to help students <br /> of the University of San Carlos
        find whatever they have lost in the campus <br /> or potential thieves
        heh
      </p>
      {console.log("User:", user)}
      {console.log("User Role:", user && user.role)}
      {user && user.role && (
        <>
          <p>
            Hello {user.firstname}, you have admin privileges! <br /> Don't go
            too crazy now
          </p>
          <List />
        </>
      )}
    </>
  );
}
