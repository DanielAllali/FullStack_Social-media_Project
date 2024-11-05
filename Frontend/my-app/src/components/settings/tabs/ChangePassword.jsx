import React, { useEffect, useRef, useState } from "react";
import "./changePassword.css";
import { useSelector } from "react-redux";
import useApi, { METHOD } from "../../../hooks/useApi";
import toast from "react-hot-toast";
import { jwtDecode } from "jwt-decode";
import { verifyCreatePost, verifyRegister } from "../../../guard";
import { useNavigate } from "react-router-dom";

const ChangePassword = ({ setIsDisplay = null }) => {
    const language = useSelector((state) => state.tiktak.language);
    const navigate = useNavigate();
    const [errors, setErrors, isLoading, apiResponse, callApi] = useApi();

    const [tab, setTab] = useState("first");
    const [method, setMethod] = useState(null);
    const [codeJwt, setCodeJwt] = useState(null);
    const [code, setCode] = useState();
    const [timeLeft, setTimeLeft] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [passwordErrors, setPasswordErrors] = useState({
        password: null,
        passwordCheck: null,
    });
    const [email, setEmail] = useState("");

    const inputRefs = useRef([]);

    useEffect(() => {
        if (apiResponse && !errors && method === "GET CODE") {
            setCodeJwt(apiResponse);
            setMethod(null);
            setTab("second");
            setTimeLeft(60);
        }
        if (timeLeft > 0 && tab === "second") {
            const interval = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        clearInterval(interval);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

            return () => clearInterval(interval);
        }
        if (apiResponse && !errors && method === "CHANGE PASSWORD") {
            toast.success(
                language === "HE"
                    ? "סיסמה שונתה בהצלחה!"
                    : "Password changed successfuly!"
            );
            if (setIsDisplay) {
                setIsDisplay(false);
                return;
            } else {
                navigate("/user/settings/main");
            }
            setMethod(null);
        }
        if (errors) {
            toast.error(errors?.response?.data);
            setErrors(null);
            setMethod(null);
        }
    }, [apiResponse, errors, method]);

    const handleSendEmail = async (e) => {
        e.preventDefault();

        const email = e.target.email.value;
        setEmail(email);
        await callApi(
            `http://localhost:9999/user/change-password/${email}`,
            METHOD.GET
        );
        setMethod("GET CODE");
    };

    const handleCodeInputChange = (e, index) => {
        const value = e.target.value;
        if (/^\d$/.test(value)) {
            e.target.value = value;

            if (index < inputRefs.current.length - 1) {
                inputRefs.current[index + 1].focus();
            }
        } else if (value === "") {
            if (index > 0) {
                inputRefs.current[index - 1].focus();
            }
        } else {
            e.target.value = "";
        }
    };

    const handleCodeSubmit = (e) => {
        e.preventDefault();
        const code = inputRefs.current.map((ref) => ref.value).join("");

        try {
            const decodedCodeJwt = jwtDecode(codeJwt);

            const currentTime = Math.floor(Date.now() / 1000);
            if (decodedCodeJwt.exp < currentTime) {
                toast.error(
                    language === "HE" ? "הקוד פג תוקף" : "The code has expired"
                );
                return;
            }

            if (code === decodedCodeJwt.code.toString()) {
                setTab("third");
                setCode(decodedCodeJwt.code);
            } else {
                toast.error(
                    language === "HE" ? "קוד לא נכון" : "Code incorrect"
                );
            }
        } catch (err) {
            if (err?.response?.data) {
                toast.error(err?.response?.data);
                return;
            }
        }
    };
    const handleNewPasswordSubmit = async (e) => {
        e.preventDefault();

        const newPassword = e.target.newPassword.value;
        const newPasswordCheck = e.target.newPasswordCheck.value;
        if (newPassword.toString() !== newPasswordCheck.toString()) {
            toast.error(
                language === "HE"
                    ? "הסיסמאות לא תואמות"
                    : "Passwords does not match"
            );
            return;
        }
        setPasswordErrors({
            password: verifyRegister.password(newPassword),
            passwordCheck: verifyRegister.password(newPasswordCheck),
        });
        if (
            verifyRegister.password(newPassword) ||
            verifyRegister.password(newPasswordCheck)
        ) {
            toast.error(
                language === "HE"
                    ? "אנא תקן את השגיאות לפני המשך"
                    : "Please fix the errors before continuing"
            );
            return;
        }

        await callApi(
            `http://localhost:9999/user/change-password/${email}`,
            METHOD.PUT,
            { password: newPassword, code }
        );

        setMethod("CHANGE PASSWORD");
    };
    return (
        <div id="changePassword">
            {tab === "first" && (
                <div className="email">
                    <h1>
                        {language === "HE" ? "שנה סיסמה" : "Change password"}
                    </h1>

                    <form onSubmit={handleSendEmail}>
                        <input type="text" id="email" />
                        <label htmlFor="email">
                            {language === "HE" ? "אימייל" : "Email"}
                        </label>
                        <input
                            disabled={isLoading}
                            type="submit"
                            value={
                                !isLoading
                                    ? language === "HE"
                                        ? "המשך"
                                        : "Continue"
                                    : language === "HE"
                                    ? "רגע..."
                                    : "Wait..."
                            }
                        />
                    </form>
                </div>
            )}
            {tab === "second" && (
                <div className="secondTab">
                    <form onSubmit={handleCodeSubmit}>
                        <h1>
                            {language === "HE"
                                ? "תכתוב את הקוד ששלחנו לך"
                                : "Enter the code we have send you"}
                        </h1>
                        <div>
                            {[...Array(6)].map((_, index) => (
                                <input
                                    key={index}
                                    type="text"
                                    maxLength="1"
                                    ref={(el) =>
                                        (inputRefs.current[index] = el)
                                    }
                                    onChange={(e) =>
                                        handleCodeInputChange(e, index)
                                    }
                                />
                            ))}
                        </div>
                        <div>
                            <span>
                                {language === "HE"
                                    ? "לא קיבלת סיסמה?"
                                    : "Didn't get code?"}
                                <button
                                    type="button"
                                    onClick={() => {
                                        setTab("first");
                                        setCodeJwt(null);
                                    }}
                                >
                                    {language === "HE"
                                        ? "סיסמה חדשה"
                                        : "New code"}
                                </button>
                            </span>
                            <h3>
                                {language === "HE"
                                    ? `נותר לך ${timeLeft} שניות`
                                    : `You have ${timeLeft}s left`}
                            </h3>
                        </div>
                        <input
                            disabled={isLoading}
                            type="submit"
                            value={language === "HE" ? "המשך" : "Continue"}
                        />
                    </form>
                </div>
            )}
            {tab === "third" && (
                <div className="thirdTab">
                    <form onSubmit={handleNewPasswordSubmit}>
                        <div>
                            <input
                                type={showPassword ? "text" : "password"}
                                id="newPassword"
                            />
                            <label htmlFor="newPassword">
                                {language === "HE"
                                    ? "סיסמה חדשה"
                                    : "New password"}
                            </label>
                            <h2
                                style={{
                                    visibility: passwordErrors.password
                                        ? "visible"
                                        : "hidden",
                                }}
                            >
                                {passwordErrors.password
                                    ? language === "HE"
                                        ? passwordErrors.password?.he
                                        : passwordErrors.password?.en
                                    : ""}
                            </h2>
                        </div>
                        <div>
                            <input
                                type={showPassword ? "text" : "password"}
                                id="newPasswordCheck"
                            />
                            <label htmlFor="newPasswordCheck">
                                {language === "HE"
                                    ? "לאשר סיסמה חדשה"
                                    : "Confirm new password"}
                            </label>
                            <h2
                                style={{
                                    visibility: passwordErrors.passwordCheck
                                        ? "visible"
                                        : "hidden",
                                }}
                            >
                                {passwordErrors.passwordCheck
                                    ? language === "HE"
                                        ? passwordErrors.passwordCheck?.he
                                        : passwordErrors.passwordCheck?.en
                                    : ""}
                            </h2>
                        </div>
                        <button
                            type="button"
                            onClick={() => {
                                setShowPassword(!showPassword);
                            }}
                        >
                            {!showPassword ? (
                                <i className="bi bi-eye-slash"></i>
                            ) : (
                                <i className="bi bi-eye"></i>
                            )}
                        </button>
                        <input
                            disabled={isLoading}
                            type="submit"
                            value={
                                language === "HE"
                                    ? "שנה סיסמה"
                                    : "Change password"
                            }
                        />
                    </form>
                </div>
            )}
            <div className="tabDots">
                <div className={tab === "first" ? "active" : ""}></div>
                <div className={tab === "second" ? "active" : ""}></div>
                <div className={tab === "third" ? "active" : ""}></div>
            </div>
        </div>
    );
};

export default ChangePassword;
