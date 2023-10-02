import React, { useState } from "react";
import "../Login.css"; // Import your CSS for styling
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
interface LoginForm {
  email: string;
  password: string;
}

function Login() {
  const [formData, setFormData] = useState<LoginForm>({
    email: "",
    password: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Send a POST request to your server to authenticate the user
      const response = await fetch("http://localhost:3000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.status === 200) {
        console.log("Login Success");
        toast.success("You are logged in", {
          position: toast.POSITION.TOP_RIGHT,
        });
        setTimeout(() => {
          setIsLoading(false);
          // User is authenticated, perform a redirect
          // e.g., history.push('/profile');
        }, 2000);
      } else {
        toast.error("Login Error", {
          position: toast.POSITION.TOP_RIGHT,
        });
        setTimeout(() => {
          setIsLoading(false);
        }, 2000);
      }
    } catch (error) {
      console.error("An error occurred:", error);
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    }
  };

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  return (
    <div className="create">
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <label>Email</label>
        <input
          type="text"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <label>Password</label>
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <div className="FormButton">
          <button className="button" type="submit" disabled={isLoading}>
            {isLoading ? <div className="shimmer">Loading...</div> : "Login"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default Login;
