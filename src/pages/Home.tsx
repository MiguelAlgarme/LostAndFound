import React, { useState, useEffect } from "react";
import axios from "axios";
import "../Home.css";

interface FormSubmission {
  id: number;
  specifyitem: string;
  description: string;
  locationfound: string;
  datefound: string;
}

const Home = () => {
  const [formSubmissions, setFormSubmissions] = useState<FormSubmission[]>([]);

  useEffect(() => {
    const fetchFormSubmissions = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/all-submissions");
        setFormSubmissions(response.data.submissions);
        console.log(response.data.submissions); // Log the received data
      } catch (error) {
        console.error("Error fetching form submissions:", error);
      }
    };
  
    fetchFormSubmissions();
  }, []);  

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString(); // Customize this function based on your date format preferences
  };

  return (
    <div className="home">
      <h1 className="header">Welcome to the Homepage of Wanderlost</h1>
      <h2> Here are some of the Reported items found </h2>
      <div className="formSubmissions">
        {formSubmissions.map((submission: FormSubmission) => (
          <div className="card" key={submission.id}>
            <h3>Item: {submission.specifyitem}</h3>
            <p>Description: {submission.description}</p>
            <p>Location Found: {submission.locationfound}</p>
            <p>Date Found: {formatDate(submission.datefound)}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
