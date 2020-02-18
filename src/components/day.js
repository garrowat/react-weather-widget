import React from "react";
import "./styles.css";

export default ({ dayData }) => {
  const { description, icon, label, max, min } = dayData;
  return dayData ? (
    <div className="daybox">
      <p>
        <span className="weekday">{label}</span>
      </p>
      <img
        alt={description}
        src={`http://openweathermap.org/img/w/${icon}.png`}
      />
      <p>
        <span className="high">{max}&deg;</span>
        <span className="low">{min}&deg;</span>
      </p>
    </div>
  ) : (
    "loading"
  );
};
