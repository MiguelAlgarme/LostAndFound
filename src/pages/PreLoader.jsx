import React, { useEffect } from "react";
import "../Landing.css";
import { preLoaderAnim } from "../animations";

function PreLoader() {
  useEffect(() => {
    preLoaderAnim();
  }, []);

  return (
    <>
      <div className="preloader">
        <div className="text-container">
          <span>Catch</span>
          <span>A</span>
          <span>Break</span>
        </div>
      </div>
    </>
  );
}

export default PreLoader;
