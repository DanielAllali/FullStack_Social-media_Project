import React from "react";
import "./refreshBtn.css";
import { useSelector } from "react-redux";

const RefreshBtn = () => {
    const language = useSelector((state) => state.tiktak.language);

    return (
        <div id="refreshButton">
            <button
                onClick={() => {
                    window.location.reload();
                }}
            >
                {language === "HE" ? "רענן את הדף" : "Refresh page"}
            </button>
        </div>
    );
};

export default RefreshBtn;
