import React from "react";
import "./loader.css";
const Loader = ({ size, bgc = "#ccc", loader = "#000" }) => {
    return (
        <div
            style={{
                width: size + "px",
                height: size + "px",
                background: bgc,
                borderRight: `5px solid ${loader}`,
            }}
            id="loader"
        ></div>
    );
};

export default Loader;
