import React, { useState } from "react";
import "./signup.css";
import { useSelector } from "react-redux";
import useApi from "../../hooks/useApi";
import Loader from "../loader/Loader";
import { Link } from "react-router-dom";
import Footer from "../footer/Footer";
import { verifyRegister } from "../../guard";

const Signup = () => {
    const language = useSelector((state) => state.tiktak.language);
    const theme = useSelector((state) => state.tiktak.theme);
    const [passwordSee, setPasswordSee] = useState(false);
    const [apiErrors, setApiErrors, isLoading, apiResponse, callApi, url] =
        useApi();

    const [fields, setFields] = useState({
        username: "",
        firstName: "",
        lastName: "",
        password: "",
        email: "",
        phone: "",
        imageSrc: "",
        imageAlt: "",
    });
    const [errors, setErrors] = useState({
        username: null,
        firstName: null,
        lastName: null,
        password: null,
        email: null,
        phone: null,
        imageSrc: null,
        imageAlt: null,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        const updatedField = {
            ...fields,
            [name]: value,
        };
        setFields(updatedField);
        const updatedErrors = {
            username: verifyRegister.username(updatedField.username),
            firstName: verifyRegister.firstName(updatedField.firstName),
            lastName: verifyRegister.lastName(updatedField.lastName),
            password: verifyRegister.password(updatedField.password),
            email: verifyRegister.email(updatedField.email),
            phone: verifyRegister.phone(updatedField.phone),
            imageSrc: verifyRegister.imageSrc(updatedField.imageSrc),
            imageAlt: verifyRegister.imageAlt(updatedField.imageAlt),
        };
        setErrors(updatedErrors);
    };

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
                    <h1>
                        {language === "HE" ? "צור משתמש" : "Create account"}
                    </h1>
                    <ul
                        style={{
                            direction: language === "HE" ? "rtl" : "ltr",
                            "--moveLabel": language === "HE" ? "-10px" : "10px",
                        }}
                    >
                        <li>
                            <div>
                                <input
                                    type="text"
                                    id="username"
                                    name="username"
                                    value={fields.username}
                                    onChange={handleChange}
                                />
                                <label htmlFor="username">
                                    {language === "HE"
                                        ? "שם משתמש"
                                        : "Username"}
                                </label>
                                {errors.username && (
                                    <h2>
                                        {language == "HE"
                                            ? errors.username.he
                                            : errors.username.en}
                                    </h2>
                                )}
                            </div>
                        </li>
                        <li style={{ marginBottom: "30px" }}>
                            <div>
                                <input
                                    type="text"
                                    id="firstName"
                                    name="firstName"
                                    value={fields.firstName}
                                    onChange={handleChange}
                                />
                                <label htmlFor="firstName">
                                    {language === "HE"
                                        ? "*שם פרטי"
                                        : "First name*"}
                                </label>
                                {errors.firstName && (
                                    <h2>
                                        {language === "HE"
                                            ? errors.firstName.he
                                            : errors.firstName.en}
                                    </h2>
                                )}
                            </div>
                            <div>
                                <input
                                    type="text"
                                    id="lastName"
                                    name="lastName"
                                    value={fields.lastName}
                                    onChange={handleChange}
                                />
                                <label htmlFor="lastName">
                                    {language === "HE"
                                        ? "*שם משפחה"
                                        : "Last name*"}
                                </label>
                                {errors.lastName && (
                                    <h2>
                                        {language === "HE"
                                            ? errors.lastName.he
                                            : errors.lastName.en}
                                    </h2>
                                )}
                            </div>
                        </li>
                        <li>
                            <div>
                                <input
                                    type={passwordSee ? "text" : "password"}
                                    id="password"
                                    name="password"
                                    value={fields.password}
                                    onChange={handleChange}
                                />
                                <label htmlFor="password">
                                    {language === "HE" ? "*סיסמה" : "Password*"}
                                </label>
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setPasswordSee(!passwordSee);
                                    }}
                                >
                                    {passwordSee ? (
                                        <i className="bi bi-eye"></i>
                                    ) : (
                                        <i className="bi bi-eye-slash"></i>
                                    )}
                                </button>
                                {errors.password && (
                                    <h2>
                                        {language === "HE"
                                            ? errors.password.he
                                            : errors.password.en}
                                    </h2>
                                )}
                            </div>
                        </li>
                        <li style={{ marginBottom: "30px" }}>
                            <div>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={fields.email}
                                    onChange={handleChange}
                                />
                                <label htmlFor="email">
                                    {language === "HE" ? "*אימייל" : "Email*"}
                                </label>
                                {errors.email && (
                                    <h2>
                                        {language === "HE"
                                            ? errors.email.he
                                            : errors.email.en}
                                    </h2>
                                )}
                            </div>
                            <div>
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    value={fields.phone}
                                    onChange={handleChange}
                                />
                                <label htmlFor="phone">
                                    {language === "HE" ? "טלפון" : "Phone"}
                                </label>
                                {errors.phone && (
                                    <h2>
                                        {language === "HE"
                                            ? errors.phone.he
                                            : errors.phone.en}
                                    </h2>
                                )}
                            </div>
                        </li>
                        <li>
                            <div>
                                <input
                                    type="text"
                                    id="imageSrc"
                                    name="imageSrc"
                                    value={fields.imageSrc}
                                    onChange={handleChange}
                                />
                                <label htmlFor="imageSrc">
                                    {language === "HE"
                                        ? "*קישור לתמונה"
                                        : "Image url*"}
                                </label>
                                {errors.imageSrc && (
                                    <h2>
                                        {language === "HE"
                                            ? errors.imageSrc.he
                                            : errors.imageSrc.en}
                                    </h2>
                                )}
                            </div>
                        </li>
                        <li>
                            <div>
                                <input
                                    type="text"
                                    id="imageAlt"
                                    name="imageAlt"
                                    value={fields.imageAlt}
                                    onChange={handleChange}
                                />
                                <label htmlFor="imageAlt">
                                    {language === "HE"
                                        ? "טקסט לתמונה"
                                        : "Image alt"}
                                </label>
                                {errors.imageAlt && (
                                    <h2>
                                        {language === "HE"
                                            ? errors.imageAlt.he
                                            : errors.imageAlt.en}
                                    </h2>
                                )}
                            </div>
                        </li>
                    </ul>
                    <button type="submit">
                        <h3>
                            {language === "HE" ? "צור משתמש" : "Create account"}
                        </h3>
                        {isLoading && <Loader />}
                    </button>
                </form>
                <hr />
                <h5>
                    {language === "HE"
                        ? "יש לך משתמש?"
                        : "Already have an account?"}{" "}
                    <Link to="/">{language === "HE" ? "התחבר" : "Login"}</Link>
                </h5>
            </div>
            <Footer />
        </div>
    );
};

export default Signup;
