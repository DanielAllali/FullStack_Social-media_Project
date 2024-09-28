import React, { useEffect, useRef, useState } from "react";
import "./welcomePage.css";
import { useSelector } from "react-redux";
import { verifyLogin } from "../../guard";
import useApi, { METHOD } from "../../hooks/useApi";
import Loader from "../loader/Loader";
import toast from "react-hot-toast";
import Footer from "../footer/Footer";

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
    const [apiErrors, setApiErrors, isLoading, apiResponse, callApi, url] =
        useApi();
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
            email: verifyLogin.email(updatedField.email),
            password: verifyLogin.password(updatedField.password),
        });

        setValidFields(
            verifyLogin.email(updatedField.email) ||
                verifyLogin.password(updatedField.password)
                ? false
                : true
        );
        setApiErrors(false);
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
    };
    useEffect(() => {
        if (apiResponse && !apiErrors) {
            toast.success("Login successfully!");
            localStorage.setItem("jwt-token", apiResponse);
        }
        if (!apiResponse && apiErrors) {
            if (apiErrors.response)
                toast.error(
                    apiErrors.response
                        ? apiErrors.response.data
                        : "Server error..."
                );
        }
    }, [apiResponse, apiErrors]);
    return (
        <div
            id="welcomeDiv"
            style={{
                "--color": theme.strong,
                "--background-color": theme.weak,
                "--btnBackground-color": theme.highlight_weak,
                "--hover-background-color": theme.highlight_strong,
            }}
        >
            <div>
                <div>
                    <h1 className="logo">Tiktak</h1>
                    <form
                        style={{ direction: language == "HE" ? "rtl" : "ltr" }}
                        onSubmit={(e) => {
                            handleSubmit(e);
                        }}
                    >
                        <div>
                            <input
                                onChange={(e) => {
                                    handleChange(e);
                                }}
                                type="email"
                                name="email"
                                id="email"
                                value={fields.email}
                            />
                            <label htmlFor="email">
                                {language == "HE" ? "אימייל" : "Email"}
                            </label>
                        </div>
                        {errors.email && <h2>{errors.email}</h2>}
                        <div>
                            <input
                                onChange={(e) => {
                                    handleChange(e);
                                }}
                                type="password"
                                name="password"
                                id="password"
                                value={fields.password}
                            />
                            <label htmlFor="password">
                                {language == "HE" ? "סיסמה" : "Password"}
                            </label>
                        </div>
                        {errors.password && <h2>{errors.password}</h2>}

                        <button
                            style={{
                                direction: language == "HE" ? "ltr" : "rtl",
                            }}
                            type="submit"
                            disabled={!validFields || isLoading}
                            className={
                                !validFields || isLoading ? "disabled" : ""
                            }
                        >
                            {isLoading && <Loader size={30} />}

                            <h3>{language === "HE" ? "התחבר/י" : "Connect"}</h3>
                        </button>
                        {apiErrors && (
                            <h2>
                                {apiErrors.response
                                    ? apiErrors.response.data
                                    : "Server error try again later..."}
                            </h2>
                        )}
                    </form>
                    <hr />
                    <h2 style={{ direction: language == "HE" ? "rtl" : "ltr" }}>
                        {language == "HE"
                            ? "אין לך משתמש?"
                            : "Don't have account?"}
                        <a href="/signup">
                            <button
                                style={{
                                    "--btnBackground-color":
                                        theme.highlight_weak,
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
            <Footer />
        </div>
    );
};

export default WelcomePage;
