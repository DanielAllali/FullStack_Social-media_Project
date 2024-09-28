import React from "react";
import "./footer.css";
import { useDispatch, useSelector } from "react-redux";
import "bootstrap-icons/font/bootstrap-icons.css";
import { setLanguage } from "../TiktakSlice";
import { Link } from "react-router-dom";

const Footer = () => {
    const language = useSelector((state) => state.tiktak.language);
    const theme = useSelector((state) => state.tiktak.theme);

    const dispatch = useDispatch();
    const handleLanguageChange = (e) => {
        dispatch(setLanguage(e.target.value));
    };
    return (
        <div id="footer">
            <h1 className="logo">Tiktak</h1>
            <ul
                style={{
                    "--color": theme.strong,
                    "--backgroundColor": theme.weak,
                }}
            >
                <Link to="/home">
                    <li>{language == "HE" ? "בית" : "Home"}</li>
                </Link>
                <Link to="/about">
                    <li>{language == "HE" ? "אודות" : "About"}</li>
                </Link>
                <Link to="/">
                    <li>{language == "HE" ? "התחבר/י" : "Login/Signup"}</li>
                </Link>
                <Link to="/help">
                    <li>{language == "HE" ? "עזרה" : "Help"}</li>
                </Link>
            </ul>
            <div>
                <div>
                    <i className="bi bi-globe2"></i>
                    <select
                        onChange={(e) => {
                            handleLanguageChange(e);
                        }}
                        name="language"
                    >
                        <option value="EN">
                            {language == "HE" ? "אנגלית" : "English"}
                        </option>
                        <option value="HE">
                            {language == "HE" ? "עברית" : "Hebrew"}
                        </option>
                    </select>
                </div>
                <h2>&copy; Daniel Allali</h2>
            </div>
        </div>
    );
};

export default Footer;
