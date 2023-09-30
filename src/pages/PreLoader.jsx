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
        <div className="texts-container">
      
          <span>Welcome</span>
          <span>To</span>
          <span>Wonderlost</span>
        </div>
      </div>
    </>
  );
}

export default PreLoader;
