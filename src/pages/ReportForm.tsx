import React, { useState } from "react";
import "../Form.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import * as Yup from "yup";
import { format } from 'date-fns';

const initialValues = {
  firstName: "",
  lastName: "",
  dateLost: "",
  locationLost: "",
  specifyItem: "",
  description: "",
  image: null,
  founderID: "",
};

const validationSchema = Yup.object().shape({
  firstName: Yup.string().required("First name is required"),
  lastName: Yup.string().required("Last name is required"),
  dateLost: Yup.date()
    .required("Date Lost is required")
    .max(format(new Date(), 'yyyy-MM-dd'), "Date lost cannot be after the present date"),
  locationLost: Yup.string().required("Location lost is required"),
  specifyItem: Yup.string().required("Specify item is required"),
  description: Yup.string().required("Description is required"),
  image: Yup.mixed().required("Image is required"),
  founderID: Yup.string().required("Founder ID is required"),
});

const CreateForm = () => {
  const handleSubmit = (
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
      <h2>Lost an Item?</h2>
      <p>Tell us more of what you lost</p>
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

            <label htmlFor="dateLost">Date Lost</label>
            <Field
              type="date"
              id="dateLost"
              name="dateLost"
              max={format(new Date(), 'yyyy-MM-dd')}
            />
            <ErrorMessage name="dateLost" component="div" className="error" />

            <label htmlFor="locationLost">Location Lost</label>
            <Field type="text" id="locationLost" name="locationLost" />
            <ErrorMessage name="locationLost" component="div" className="error" />

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