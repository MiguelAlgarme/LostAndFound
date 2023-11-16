import React, { ReactNode, useState, useEffect } from "react";
import { Route, Navigate } from "react-router-dom";

interface CheckerProps {
  children: ReactNode;
}

const Checker = ({ children }: CheckerProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const response = await fetch("/api/check-auth");
        const data = await response.json();

        if (data.isAuthenticated) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
      }
    };
    checkAuthentication();
  }, []);

  return (
    <Route
      element={
        isAuthenticated ? (
          children
        ) : (
          <>
            <Navigate to="/login" />
          </>
        )
      }
    />
  );
};

export default Checker;
