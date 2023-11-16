import React, { useState } from "react";
import "../Login.css"; // Import your CSS for styling
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as yup from "yup";

interface LoginForm {
  email: string;
  password: string;
}

const validate = yup.object().shape({
  email: yup
    .string()
    .email("Enter a valid email")
    .required("Email is required"),
  password: yup.string().required("Password is required"),
});

interface User {
  firstname: string;
  lastname: string;
}

interface LoginProps {
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}
function Login({ setUser }: LoginProps) {
  const [formData, setFormData] = useState<LoginForm>({
    email: "",
    password: "",
  });
  const [formErrors, setFormErrors] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const { email, password } = formData;

    try {
      const response = await fetch("http://localhost:3000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
        credentials: "include",
      });

      if (response.status === 200) {
        const data = await response.json();
        setUser(data.user);
        console.log("Login Success");
        toast.success("You are logged in", {
          position: toast.POSITION.TOP_RIGHT,
        });
        setTimeout(() => {
          setIsLoading(false);
          //Redirect insert hereeeeeee
        }, 2000);
      } else if (response.status === 401) {
        toast.error("Invalid Credentials", {
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
    {
      const { name, value } = event.target;
      setFormData((prevData) => ({ ...prevData, [name]: value }));

      try {
        validate.validateSyncAt(name, { [name]: value });

        setFormErrors({ ...formErrors, [name]: undefined });
      } catch (error: any) {
        // ^^^^^^^^ This defeats the purpose of typescript btw
        //typescript strict like ong

        setFormErrors({ ...formErrors, [name]: error.message });
      }
    }
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
        {formErrors.email && (
          <div className="error-message">{formErrors.email}</div>
        )}

        <label>Password</label>
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        {formErrors.password && (
          <div className="error-message">{formErrors.password}</div>
        )}
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
