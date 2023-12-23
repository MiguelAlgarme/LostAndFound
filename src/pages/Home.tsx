import React, { useState, useEffect } from "react";
import axios from "axios";
import "../Home.css";

interface FormSubmission {
  id: number;
  specifyitem: string;
  description: string;
  locationfound: string;
  datefound: string;
  founderID: number; // Assuming there's a founderID in FormSubmission
}

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

const Home = () => {
  const [formSubmissions, setFormSubmissions] = useState<FormSubmission[]>([]);
  const [usersMap, setUsersMap] = useState<Record<number, User>>({});

  useEffect(() => {
    const fetchFormSubmissions = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/all-submissions");
        setFormSubmissions(response.data.submissions);
  
        // Extract founder IDs and fetch user data for each unique founder ID
        const uniqueFounderIDs = Array.from(new Set(response.data.submissions
          .filter(submission => submission.founderID !== undefined)
          .map(submission => submission.founderID)
        ));
  
        await Promise.all(
          uniqueFounderIDs.map(async (founderID) => {
            const userResponse = await axios.get(`http://localhost:3000/api/user/${founderID}`);
            setUsersMap(prevUsersMap => ({
              ...prevUsersMap,
              [String(founderID)]: userResponse.data.user,
            }));
          })
        );
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
            {usersMap[submission.founderID] && (
              <div key={submission.id}>
                <p>Reporter: {usersMap[submission.founderID].firstName} {usersMap[submission.founderID].lastName}</p>
                <p>Email: {usersMap[submission.founderID].email}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
