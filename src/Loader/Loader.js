import React from 'react';
import './Loader.css'; // Import the CSS file

function Loader() {
  return (
    <div className="loader-container">
      <div className="dot-loader">
        <div className="dot"></div>
        <div className="dot"></div>
        <div className="dot"></div>
      </div>
    </div>
  );
}

export default Loader;
