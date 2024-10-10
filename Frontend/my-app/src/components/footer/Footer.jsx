import React from "react";
import "./footer.css";
import { useDispatch, useSelector } from "react-redux";
import "bootstrap-icons/font/bootstrap-icons.css";
import { setDarkTheme, setLanguage, setLightTheme } from "../TiktakSlice";
import { Link } from "react-router-dom";

const Footer = ({
    displayLogo = true,
    displayNav = true,
    displaySettings = true,
    marginTop = true,
}) => {
    const language = useSelector((state) => state.tiktak.language);
    const theme = useSelector((state) => state.tiktak.theme);

    const dispatch = useDispatch();
    const handleLanguageChange = (e) => {
        dispatch(setLanguage(e.target.value));
    };
    const handleChangeTheme = () => {
        if (theme.type != "dark") {
            dispatch(setDarkTheme());
            return;
        }
        if (theme.type != "light") {
            dispatch(setLightTheme());
            return;
        }
    };
    return (
        <div id="footer" style={{ marginTop: marginTop ? "40px" : "0" }}>
            {displayLogo && <h1 className="logo">Tiktak</h1>}
            {displayNav && (
                <ul
                    style={{
                        "--color": theme.strong,
                        "--backgroundColor": theme.weak,
                    }}
                >
                    <Link to="/">
                        <li>{language == "HE" ? "בית" : "Home"}</li>
                    </Link>
                    <Link to="/about">
                        <li>{language == "HE" ? "אודות" : "About"}</li>
                    </Link>
                    {!localStorage.getItem("jwt-token") && (
                        <Link to="/login">
                            <li>
                                {language == "HE" ? "התחבר/י" : "Login/Signup"}
                            </li>
                        </Link>
                    )}
                    <Link to="/help">
                        <li>{language == "HE" ? "עזרה" : "Help"}</li>
                    </Link>
                </ul>
            )}
            {displaySettings && (
                <div>
                    <button onClick={handleChangeTheme}>
                        {localStorage.getItem("Theme") == "light" ? (
                            <i className="bi bi-brightness-high"></i>
                        ) : (
                            <i className="bi bi-moon"></i>
                        )}
                    </button>
                    <div>
                        <i className="bi bi-globe2"></i>
                        <select
                            onChange={(e) => {
                                handleLanguageChange(e);
                            }}
                            name="language"
                        >
                            {language === "HE" && (
                                <>
                                    <option value="HE">
                                        {language == "HE" ? "עברית" : "Hebrew"}
                                    </option>
                                    <option value="EN">
                                        {language == "HE"
                                            ? "אנגלית"
                                            : "English"}
                                    </option>
                                </>
                            )}
                            {language !== "HE" && (
                                <>
                                    <option value="EN">
                                        {language == "HE"
                                            ? "אנגלית"
                                            : "English"}
                                    </option>
                                    <option value="HE">
                                        {language == "HE" ? "עברית" : "Hebrew"}
                                    </option>
                                </>
                            )}
                        </select>
                    </div>
                    <h2>&copy; Daniel Allali</h2>
                </div>
            )}
        </div>
    );
};

export default Footer;
