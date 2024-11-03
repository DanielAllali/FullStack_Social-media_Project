import React from "react";
import "./loader.css";
const Loader = ({ size }) => {
    return (
        <span
            style={{
                "--size": `${size}px`,
            }}
            id="loader"
        ></span>
    );
};

export default Loader;
