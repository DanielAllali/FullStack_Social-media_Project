import React from "react";
import "./signup.css";
import { useSelector } from "react-redux";
import useApi from "../../hooks/useApi";
import Loader from "../loader/Loader";
import { Link } from "react-router-dom";
import Footer from "../footer/Footer";

const Signup = () => {
    const language = useSelector((state) => state.tiktak.language);
    const theme = useSelector((state) => state.tiktak.theme);
    const [apiErrors, setApiErrors, isLoading, apiResponse, callApi, url] =
        useApi();

    return (
        <div
            id="signup"
            style={{
                "--bgc": theme.weak,
                "--color": theme.strong,
                "--btnBgc": theme.highlight_weak,
                "--btnHover": theme.highlight_strong,
            }}
        >
            <div className="content">
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                    }}
                >
                    <h1>{language == "HE" ? "צור משתמש" : "Create account"}</h1>
                    <ul
                        style={{
                            direction: language == "HE" ? "rtl" : "ltr",
                            "--moveLabel": language == "HE" ? "-10px" : "10px",
                        }}
                    >
                        <li>
                            <div>
                                <label htmlFor="username">
                                    {language == "HE" ? "שם משתמש" : "Username"}
                                </label>
                                <input type="text" id="username" />
                            </div>
                        </li>
                        <li>
                            <div>
                                <input type="text" id="firstName" />
                                <label htmlFor="firstName">
                                    {language == "HE"
                                        ? "*שם פרטי"
                                        : "First name*"}
                                </label>
                            </div>
                            <div>
                                <input type="text" id="lastName" />
                                <label htmlFor="lastName">
                                    {language == "HE"
                                        ? "*שפ משפחה"
                                        : "Last name*"}
                                </label>
                            </div>
                        </li>
                        <li>
                            <div>
                                <input type="password" id="password" />
                                <label htmlFor="password">
                                    {language == "HE" ? "*סיסמה" : "Password*"}
                                </label>
                            </div>
                        </li>
                        <li>
                            <div>
                                <input type="email" id="email" />
                                <label htmlFor="email">
                                    {language == "HE" ? "*אימייל" : "Email*"}
                                </label>
                            </div>
                            <div>
                                <input type="tel" id="phone" />
                                <label htmlFor="phone">
                                    {language == "HE" ? "טלפון" : "Phone*"}
                                </label>
                            </div>
                        </li>
                        <li>
                            <div>
                                <input type="text" id="imageSrc" />
                                <label htmlFor="imageSrc">
                                    {language == "HE"
                                        ? "קישור לתמונה"
                                        : "Image url"}
                                </label>
                            </div>
                        </li>
                        <li>
                            <div>
                                <input type="text" id="imageAlt" />
                                <label htmlFor="imageAlt">
                                    {language == "HE"
                                        ? "טקסט לתמונה"
                                        : "Image alt"}
                                </label>
                            </div>
                        </li>
                    </ul>
                    <button type="submit">
                        <h3>
                            {language == "HE" ? "צור משתמש" : "Create account"}
                        </h3>
                        {isLoading && <Loader />}
                    </button>
                </form>
                <hr />
                <h5>
                    {language == "HE"
                        ? "יש לך משתמש?"
                        : "Already have account?"}{" "}
                    <Link to="/">{language == "HE" ? "התחבר" : "Login"}</Link>
                </h5>
            </div>
            <Footer />
        </div>
    );
};

export default Signup;
