import React, { useState } from "react";
import "../Form.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const Form = () => {
  const [title, setTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const toastContainer = <ToastContainer />;
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsLoading(true);

    setTimeout(() => {
      console.log("Form submitted");
      setIsLoading(false);

      toast.success("Your form has been submitted.", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }, 2000);
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
      <h2>CREATION</h2>
      <p>Send us anything</p>
      <form onSubmit={handleSubmit}>
        <label>First Name</label>
        <input
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <label>Last Name</label>
        <input type="text" required />

        <label>Middle Name</label>
        <input type="text" required />

        <label>Age</label>
        <input type="number" required />

        <label>Email</label>
        <input type="email" required />

        <label>Phone Number</label>
        <input type="number" required />

        <label>University</label>
        <input type="text" />

        <label>ID</label>
        <input type="file" required />
        <div className="FormButton">
          <button className="button" type="submit" disabled={isLoading}>
            {isLoading ? <div className="shimmer">Loading...</div> : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
};
export default Form;
