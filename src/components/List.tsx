import React, { useEffect, useState } from "react";
import axios from "axios";
import "../List.css";

interface User {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  role: string; // Make sure to include the role property
}

const List: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/all-users",
          {
            withCredentials: true,
          }
        );

        // Filter out the admin user
        const filteredUsers = response.data.users.filter(
          (user: User) => user.role !== "ADMIN"
        );

        setUsers(filteredUsers);
      } catch (error) {
        console.error("Error fetching users...", error);
      }
    };

    fetchUsers();
  }, []);

  const handleDeleteUser = async (userId: string) => {
    try {
      await axios.delete(`http://localhost:3000/api/delete-user/${userId}`, {
        withCredentials: true,
      });

      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
    } catch (error) {
      console.error("Error deleting user...", error);
    }
  };

  return (
    <div className="userList">
      {" "}
      <h1>User's List</h1>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.firstname} {user.lastname} - {user.email}
            <button onClick={() => handleDeleteUser(user.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default List;
