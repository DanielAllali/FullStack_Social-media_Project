import React, { useEffect, useState } from "react";
import "./signup.css";
import { useDispatch, useSelector } from "react-redux";
import useApi, { METHOD } from "../../hooks/useApi";
import Loader from "../loader/Loader";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../footer/Footer";
import { verifyRegister } from "../../guard";
import toast from "react-hot-toast";
import { login } from "../TiktakSlice";
import { jwtDecode } from "jwt-decode";

const Signup = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [method, setMethod] = useState(null);
    const language = useSelector((state) => state.tiktak.language);
    const theme = useSelector((state) => state.tiktak.theme);
    const [passwordSee, setPasswordSee] = useState(false);
    const [isValidForm, setIsValidForm] = useState(false);
    const [apiErrors, setApiErrors, isLoading, apiResponse, callApi, url] =
        useApi();

    const [fields, setFields] = useState({
        username: "",
        firstName: "",
        lastName: "",
        password: "",
        email: "",
        phone: "",
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
            imageSrc: verifyRegister.imageSrc(
                document.querySelector('input[type="file"]').files[0]
            ),
            imageAlt: verifyRegister.imageAlt(updatedField.imageAlt),
        };
        setErrors(updatedErrors);
        for (const error in updatedErrors) {
            if (updatedErrors[error]) {
                setIsValidForm(false);
                return;
            }
        }
        setIsValidForm(true);
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = {
            username: verifyRegister.username(fields.username),
            firstName: verifyRegister.firstName(fields.firstName),
            lastName: verifyRegister.lastName(fields.lastName),
            password: verifyRegister.password(fields.password),
            email: verifyRegister.email(fields.email),
            phone: verifyRegister.phone(fields.phone),
            imageAlt: verifyRegister.imageAlt(fields.imageAlt),
        };
        for (const error in newErrors) {
            if (newErrors[error]) {
                return;
            }
        }
        const newUser = {
            username: fields.username,
            name: {
                firstName: fields.firstName,
                lastName: fields.lastName,
            },
            email: fields.email,
            phone: fields.phone,
            password: fields.password,
            image: {
                src: fields.imageSrc,
                alt: fields.imageAlt,
            },
        };
        const formData = new FormData();

        formData.append("username", newUser.username);
        formData.append("name[firstName]", newUser.name.firstName);
        formData.append("name[lastName]", newUser.name.lastName);
        formData.append("email", newUser.email);
        formData.append("phone", newUser.phone);
        formData.append("password", newUser.password);

        const imageFile = document.querySelector('input[type="file"]').files[0];

        if (imageFile) {
            formData.append("image", imageFile);
        }

        setMethod("REGISTER");
        await callApi("http://localhost:9999/users", METHOD.POST, formData, {
            "Content-Type": "multipart/form-data",
        });
    };
    useEffect(() => {
        if (method === "REGISTER") {
            if (apiResponse && !apiErrors) {
                const login = async () => {
                    setMethod("LOGIN");
                    await callApi(
                        "http://localhost:9999/users/login",
                        METHOD.POST,
                        {
                            email: fields.email,
                            password: fields.password,
                        }
                    );
                };
                login();
            }
            if (!apiResponse && apiErrors) {
                if (apiErrors.status === 409) {
                    toast.error(
                        language === "HE"
                            ? "יש משתמש עם האימייל הזה כבר..."
                            : "This email is already taken..."
                    );
                    setApiErrors(null);
                } else if (apiErrors && apiErrors.response)
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
                setApiErrors(null);
            }
        }
        if (method === "LOGIN") {
            if (apiResponse) {
                localStorage.setItem("jwt-token", apiResponse);
                try {
                    dispatch(login(jwtDecode(apiResponse)));

                    toast.success(
                        language == "HE"
                            ? "התחברת בהצלחה!"
                            : "Login successfully!"
                    );
                    navigate("/");
                } catch (err) {
                    localStorage.removeItem("jwt-token");
                    toast.error(err.message);
                }
            }
        }
    }, [apiResponse, apiErrors]);
    return (
        <div
            id="signup"
            style={{
                "--bgc": theme.bgc,
                "--color": theme.strong,
                "--btnBgc": theme.highlight_weak,
                "--btnHover": theme.highlight_strong,
            }}
        >
            <div className="content">
                <form onSubmit={handleSubmit}>
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
                                    type="file"
                                    id="imageSrc"
                                    name="imageSrc"
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
                    <button
                        type="submit"
                        disabled={!isValidForm}
                        className={isValidForm ? "" : "disabled"}
                    >
                        <h3>
                            {language === "HE" ? "צור משתמש" : "Create account"}
                        </h3>
                        {isLoading && <Loader size={30} />}
                    </button>
                    {apiErrors && apiErrors.response && (
                        <h2>{apiErrors.response.data}</h2>
                    )}
                </form>
                <hr />
                <h5>
                    {language === "HE"
                        ? "יש לך משתמש?"
                        : "Already have an account?"}{" "}
                    <Link to="/login">
                        {language === "HE" ? "התחבר" : "Login"}
                    </Link>
                </h5>
                <Link to="/">
                    <h5>
                        {language === "HE" ? "המשך כאורח" : "Continue as quest"}
                    </h5>
                </Link>
            </div>
            <Footer displayArrow={false} />
        </div>
    );
};

export default Signup;
