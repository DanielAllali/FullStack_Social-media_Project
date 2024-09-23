import React, { useEffect, useRef, useState } from "react";
import "./welcomePage.css";
import { useSelector } from "react-redux";
import { verifyLogin } from "../../guard";
import useApi, { METHOD } from "../../hooks/useApi";

const WelcomePage = () => {
    const BASE_URL = "http://localhost:9999";
    const [fields, setFields] = useState({
        email: "",
        password: "",
    });
    const [errors, setErrors] = useState({
        email: null,
        password: null,
    });
    const [validFields, setValidFields] = useState(false);
    const [apiErrors, isLoading, apiResponse, callApi, url] = useApi();
    const language = useSelector((state) => state.tiktak.language);
    const theme = useSelector((state) => state.tiktak.theme);

    const handleChange = (e) => {
        const { name, value } = e.target;
        const updatedField = {
            ...fields,
            [name]: value,
        };
        setFields(updatedField);
        setErrors({
            email: verifyLogin.email(fields.email),
            password: verifyLogin.password(fields.password),
        });

        setValidFields(
            verifyLogin.email(fields.email) ||
                verifyLogin.password(fields.password)
                ? false
                : true
        );
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = {
            email: verifyLogin.email(fields.email),
            password: verifyLogin.password(fields.password),
        };
        if (newErrors.email || newErrors.email) {
            return;
        }
        await callApi(BASE_URL + "/users/login", METHOD.POST, {
            email: fields.email,
            password: fields.password,
        });
        console.log(apiResponse ? apiResponse : apiErrors);
    };
    return (
        <div id="welcomeDiv">
            <div style={{ direction: language == "HE" ? "rtl" : "ltr" }}>
                <div>
                    <h1>Tiktak</h1>
                    <form
                        onSubmit={(e) => {
                            handleSubmit(e);
                        }}
                    >
                        <label htmlFor="email">
                            {language == "HE" ? "אימייל" : "Email"}
                        </label>
                        <input
                            onChange={(e) => {
                                handleChange(e);
                            }}
                            type="email"
                            name="email"
                            id="email"
                            value={fields.email}
                        />
                        {errors.email && <h2>{errors.email}</h2>}
                        <label htmlFor="password">
                            {language == "HE" ? "סיסמה" : "Password"}
                        </label>
                        <input
                            onChange={(e) => {
                                handleChange(e);
                            }}
                            type="password"
                            name="password"
                            id="password"
                            value={fields.password}
                        />
                        {errors.password && <h2>{errors.password}</h2>}

                        <input
                            style={{
                                "--background-color": theme.highlight_weak,
                                "--hover-background-color":
                                    theme.highlight_strong,
                            }}
                            type="submit"
                            value={language == "HE" ? "התחבר/י" : "Conact"}
                            disabled={!validFields}
                            className={!validFields ? "disabled" : ""}
                        />
                    </form>
                    <hr />
                    <h2>
                        {language == "HE"
                            ? "אין לך משתמש?"
                            : "Don't have account?"}
                        <a href="/signup">
                            <button
                                style={{
                                    "--background-color": theme.highlight_weak,
                                    "--hover-background-color":
                                        theme.highlight_strong,
                                }}
                            >
                                {language == "HE" ? "להרשמה" : "Signup"}
                            </button>
                        </a>
                    </h2>
                </div>
                <div></div>
            </div>
        </div>
    );
};

export default WelcomePage;
