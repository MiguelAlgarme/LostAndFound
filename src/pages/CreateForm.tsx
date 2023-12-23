import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../Profile.css";
import { format } from 'date-fns';
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import * as Yup from "yup";

const initialValues = {
  dateFound: "",
  locationFound: "",
  specifyItem: "",
  description: "",
};

const validationSchema = Yup.object().shape({
  dateFound: Yup.date()
    .required("Date found is required")
    .max(format(new Date(), 'yyyy-MM-dd'), "Date found cannot be after the present date"),
  locationFound: Yup.string().required("Location found is required"),
  specifyItem: Yup.string().required("Specify item is required"),
  description: Yup.string().required("Description is required"),
});

type User = {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  role: string;
};

const CreateForm = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showRegister, setShowRegister] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);
  const [userList, setUserList] = useState<User[]>([]);
  //Some codes here aren't used, some were created for experimentation only.
  //Bruh

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
        setUser(response.data.user);
      } catch (error) {
        console.error("Error fetching update account information...", error);
      }
    };

    fetchUpdateAccountInfo();
  }, []);

  useEffect(() => {
    const fetchUserList = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/all-users",
          {
            withCredentials: true,
          }
        );
        setUserList(response.data.users);
      } catch (error) {
        console.error("Error fetching user list...", error);
      }
    };

    fetchUserList();
  }, []);

  const handleSubmit = async (
    values: typeof initialValues,
    { setSubmitting }: FormikHelpers<typeof initialValues>
  ) => {
    try {
      const valuesWithFounderID = {
        ...values,
        founderID: user?.id, // Assuming `user` contains the logged-in user's details
      };
  
      const response = await axios.post(
        "http://localhost:3000/api/founditems",
        valuesWithFounderID, // Send form values with founderID
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
  
      if (response.status === 201) {
        toast.success("Form submitted successfully!");
        // Handle success - show success message, update UI, etc.
      } else {
        toast.error("Submission failed");
        // Handle other status codes if needed
      }
    } catch (error: any) {
      console.error('Error submitting form:', error);
      toast.error("Error submitting form. Please try again later.");
      // Handle errors - show error messages, revert changes, etc.
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div>
      {user !== null ? (
        <>
          <p>Welcome, {user.firstname}!</p>
          <div className="UserInfo">
            <p>ID number: {user.id}</p>
            <p>Email: {user.email}</p>
          </div>
          <div className="create">
        <h2>Report Found Item</h2>
        <p>Please provide details about the found item</p>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <label htmlFor="dateFound">Date Found</label>
              <Field
                type="date"
                id="dateFound"
                name="dateFound"
                max={format(new Date(), 'yyyy-MM-dd')}
              />
              <ErrorMessage name="dateFound" component="div" className="error" />
  
              <label htmlFor="locationFound">Location Found</label>
              <Field type="text" id="locationFound" name="locationFound" />
              <ErrorMessage name="locationFound" component="div" className="error" />
  
              <label htmlFor="specifyItem">Specify Item</label>
              <Field type="text" id="specifyItem" name="specifyItem" />
              <ErrorMessage name="specifyItem" component="div" className="error" />
  
              <label htmlFor="description">Description and Personal Information</label>
              <Field as="textarea" id="description" name="description" />
              <ErrorMessage name="description" component="div" className="error" />
  
              <div className="FormButton">
                <button
                  className="button"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="shimmer">Loading...</div>
                  ) : (
                    "Submit"
                  )}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
        </>
      ) : (
        <p>Please log in to report a found item.</p>
      )}
    </div>
  );
};

export default CreateForm;
