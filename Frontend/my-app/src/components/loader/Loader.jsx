import React from "react";
import "./loader.css";
const Loader = ({ size, bgc = "#ccc", loader = "#000" }) => {
    return (
        <div
            style={{
                width: size + "px",
                height: size + "px",
            }}
            id="loader"
        ></div>
    );
};

export default Loader;
