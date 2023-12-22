import React, { useState } from "react";
import "../Form.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import * as Yup from "yup";
import { parseISO } from 'date-fns';

const initialValues = {
  firstName: "",
  lastName: "",
  dateFound: "",
  locationFound: "",
  specifyItem: "",
  description: "",
  image: null,
  founderID: "",
};

const validationSchema = Yup.object().shape({
  firstName: Yup.string().required("First name is required"),
  lastName: Yup.string().required("Last name is required"),
  dateFound: Yup.date()
    .required("Date found is required")
    .max(new Date(), "Date found cannot be after the present date")
    .transform((value, originalValue) => {
      // Parse the date string to a Date object for validation
      return originalValue ? parseISO(originalValue) : value;
    }),
  locationFound: Yup.string().required("Location found is required"),
  specifyItem: Yup.string().required("Specify item is required"),
  description: Yup.string().required("Description is required"),
  image: Yup.mixed().required("Image is required"),
  founderID: Yup.string().required("Founder ID is required"),
});

const CreateForm = () => {
  const handleSubmit = async (
    values: typeof initialValues,
    { setSubmitting }: FormikHelpers<typeof initialValues>
  ) => {
    setTimeout(() => {
      console.log(values);
      setSubmitting(false);
      // Perform your submission logic here, like API calls to send data to the backend
    }, 2000);
  };

  return (
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
            <label htmlFor="firstName">First Name</label>
            <Field type="text" id="firstName" name="firstName" />
            <ErrorMessage name="firstName" component="div" className="error" />

            <label htmlFor="lastName">Last Name</label>
            <Field type="text" id="lastName" name="lastName" />
            <ErrorMessage name="lastName" component="div" className="error" />

            <label htmlFor="dateFound">Date Found</label>
            <Field type="date" id="dateFound" name="dateFound" />
            <ErrorMessage name="dateFound" component="div" className="error" />

            <label htmlFor="locationFound">Location Found</label>
            <Field type="text" id="locationFound" name="locationFound" />
            <ErrorMessage name="locationFound" component="div" className="error" />

            <label htmlFor="specifyItem">Specify Item</label>
            <Field type="text" id="specifyItem" name="specifyItem" />
            <ErrorMessage name="specifyItem" component="div" className="error" />

            <label htmlFor="description">Description of Item</label>
            <Field as="textarea" id="description" name="description" />
            <ErrorMessage name="description" component="div" className="error" />

            <label htmlFor="image">Image of Item</label>
            <Field type="file" id="image" name="image" />
            <ErrorMessage name="image" component="div" className="error" />

            <label htmlFor="founderID">ID of Founder</label>
            <Field type="file" id="founderID" name="founderID" />
            <ErrorMessage name="founderID" component="div" className="error" />

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
  );
};

export default CreateForm;