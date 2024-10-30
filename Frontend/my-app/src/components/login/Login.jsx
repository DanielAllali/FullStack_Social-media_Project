import React, { useEffect, useRef, useState } from "react";
import "./login.css";
import { useDispatch, useSelector } from "react-redux";
import { verifyLogin } from "../../guard";
import useApi, { METHOD } from "../../hooks/useApi";
import Loader from "../loader/Loader";
import toast from "react-hot-toast";
import Footer from "../footer/Footer";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../TiktakSlice";
import { jwtDecode } from "jwt-decode";

const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const BASE_URL = "http://localhost:9999";
    const [passwordSee, setPasswordSee] = useState(false);
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
            try {
                if (!jwtDecode(apiResponse).deleted) {
                    dispatch(login(jwtDecode(apiResponse)));
                    localStorage.setItem("jwt-token", apiResponse);
                    toast.success(
                        language == "HE"
                            ? "התחברת בהצלחה!"
                            : "Login successfully!"
                    );
                    navigate("/");
                } else {
                    toast.error(
                        language == "HE"
                            ? "משתמש זה מחוק."
                            : "This user is deleted."
                    );
                }
            } catch (err) {
                localStorage.removeItem("jwt-token");
                toast.error(err.message);
            }
        }
        if (!apiResponse && apiErrors) {
            if (apiErrors.response)
                toast.error(
                    apiErrors.response
                        ? apiErrors.response.data ===
                          "Email or password uncorrect."
                            ? language === "HE"
                                ? "אימייל או סיסמה לא נכונים."
                                : apiErrors.response.data
                            : language === "HE"
                            ? "תקלה בשרת נסה שוב מאוחר יותר..."
                            : "Server error try again later..."
                        : ""
                );
        }
    }, [apiResponse, apiErrors]);
    return (
        <div
            id="welcomeDiv"
            style={{
                "--color": theme.strong,
                "--background-color": theme.bgc,
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
                        {errors.email && (
                            <h2>
                                {language == "HE"
                                    ? errors.email.he
                                    : errors.email.en}
                            </h2>
                        )}
                        <div>
                            <input
                                onChange={(e) => {
                                    handleChange(e);
                                }}
                                type={passwordSee ? "text" : "password"}
                                name="password"
                                id="password"
                                value={fields.password}
                            />
                            <label htmlFor="password">
                                {language == "HE" ? "סיסמה" : "Password"}
                            </label>
                        </div>
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
                                {language == "HE"
                                    ? errors.password.he
                                    : errors.password.en}
                            </h2>
                        )}

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
                                    ? apiErrors.response.data ===
                                      "Email or password uncorrect."
                                        ? language === "HE"
                                            ? "אימייל או סיסמה לא נכונים."
                                            : apiErrors.response.data
                                        : language === "HE"
                                        ? "תקלה בשרת נסה שוב מאוחר יותר..."
                                        : "Server error try again later..."
                                    : ""}
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
                    <Link to="/">
                        <h5>
                            {language === "HE"
                                ? "המשך כאורח"
                                : "Continue as quest"}
                        </h5>
                    </Link>
                </div>
                <div></div>
            </div>
            <Footer displayArrow={false} />
        </div>
    );
};

export default Login;
