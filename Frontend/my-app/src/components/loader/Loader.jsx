import React from "react";
import "./loader.css";
const Loader = ({ size }) => {
    return (
        <span
            style={{
                width: size + "px !important",
                height: size + "px !important",
            }}
            id="loader"
        ></span>
    );
};

export default Loader;
