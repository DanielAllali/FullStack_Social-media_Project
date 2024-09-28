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
                    <ul>
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
                                <label htmlFor="firstName">
                                    {language == "HE"
                                        ? "שם פרטי"
                                        : "First name"}
                                </label>
                                <input type="text" id="firstName" />
                            </div>
                            <div>
                                <label htmlFor="lastName">
                                    {language == "HE"
                                        ? "שפ משפחה"
                                        : "Last name"}
                                </label>
                                <input type="text" id="lastName" />
                            </div>
                        </li>
                        <li>
                            <div>
                                <label htmlFor="password">
                                    {language == "HE" ? "סיסמה" : "Password"}
                                </label>
                                <input type="password" id="password" />
                            </div>
                        </li>
                        <li>
                            <div>
                                <label htmlFor="email">
                                    {language == "HE" ? "אימייל" : "Email"}
                                </label>
                                <input type="email" id="email" />
                            </div>
                            <div>
                                <label htmlFor="phone">Phone</label>
                                <input type="tel" id="phone" />
                            </div>
                        </li>
                        <li>
                            <div>
                                <label htmlFor="imageSrc">
                                    {language == "HE"
                                        ? "קישור לתמונה"
                                        : "Image url"}
                                </label>
                                <input type="text" id="imageSrc" />
                            </div>
                        </li>
                        <li>
                            <div>
                                <label htmlFor="imageAlt">
                                    {language == "HE"
                                        ? "טקסט מחליף לתמונה"
                                        : "Image alt"}
                                </label>
                                <input type="text" id="imageAlt" />
                            </div>
                        </li>
                    </ul>
                    <button>
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
