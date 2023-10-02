import React, { useState } from "react";
import "../Form.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import zxcvbn from "zxcvbn";

interface RegistrationForm {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

function Register() {
  const [formData, setFormData] = useState<RegistrationForm>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  //I found a problem where it would blink
  //and not accept passwords that are not strong enough,
  //but then blink to strong when only one letter will change
  //I MIGHT try other libraries.
  //PASSWORD STRENGTH

  const [passwordStrength, setPasswordStrength] = useState("WEAK!");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = event.target.value;
    setFormData((prevData) => ({ ...prevData, password: newPassword }));

    const result = zxcvbn(newPassword);

    setPasswordStrength(result.score >= 2 ? "Eh its ok I guess" : "WEAK!");
  };
  //PASSWORD STRENGTH

  //PASSWORD STATE COLOR
  const PassCo = () => {
    switch (passwordStrength) {
      case "WEAK!":
        return "red";
      case "Eh its ok I guess":
        return "Green";
      default:
        return "white";
    }
  };
  //PASSWORD STATE COLOR

  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    //PASSWORD CONFIRMATIONN
    if (formData.password !== passwordConfirm) {
      toast.error("Passwords do not match", {
        position: toast.POSITION.TOP_RIGHT,
      });
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
      return;
    }
    //PASSWORD CONFIRMATIONN

    try {
      const response = await fetch("http://localhost:3000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.status === 200) {
        console.log("Registration successful");

        setTimeout(() => {
          setIsLoading(false);
        }, 2000);

        toast.success("You have been registered!", {
          position: toast.POSITION.TOP_RIGHT,
        });

        // Should add a redirect
      } else {
        toast.warning("Registration Error", {
          position: toast.POSITION.TOP_RIGHT,
        });
        setTimeout(() => {
          setIsLoading(false);
        }, 2000);
      }
    } catch (error) {
      console.error("An error occurred:", error);
      setIsLoading(false);
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
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <label>First Name</label>
        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          value={formData.firstName}
          onChange={handleChange}
          required
        />
        <label>Last Name</label>
        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          value={formData.lastName}
          onChange={handleChange}
          required
        />
        <label>Email</label>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <br />
        <label>Password</label>
        {/*Creating a CSS for this is too tiresome, might as well put it here*/}
        <div
          className="password-strength"
          style={{
            color: PassCo(),
            padding: "2px 2px",
            margin: "4px 0",
            fontSize: "16px",
            fontWeight: "bold",
            transition: "color 1.0s",
          }}
        >
          {passwordStrength}
        </div>

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handlePasswordChange}
          required
        />

        <label>Confirm Password</label>
        <input
          type="password"
          name="passwordConfirm"
          placeholder="Confirm Password"
          value={passwordConfirm}
          onChange={(e) => setPasswordConfirm(e.target.value)}
          required
        />
        <div className="FormButton">
          <button className="button" type="submit" disabled={isLoading}>
            {isLoading ? <div className="shimmer">Loading...</div> : "Register"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default Register;
