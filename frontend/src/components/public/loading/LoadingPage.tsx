import React from "react";
import "./LoadingPage.scss";

export const LoadingPage = () => {
  return (
    <div id="loading-page">
      <div className="container">
        <div className="ring"></div>
        <div className="ring"></div>
        <div className="ring"></div>
        <span className="text">Loading...</span>
      </div>
    </div>
  );
};
