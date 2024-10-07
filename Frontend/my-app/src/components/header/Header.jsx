import React, { useEffect, useState } from "react";
import "./header.css";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { login, logout } from "../TiktakSlice";
import { jwtDecode } from "jwt-decode";
import toast from "react-hot-toast";
import logo from "../../media/images/Logo.png";
import SandboxSmall from "./SandboxSmall";

const Header = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const [userSettings, setUserSettings] = useState(false);
    const [isSandbox, setIsSandbox] = useState(false);

    const user = useSelector((state) => state.tiktak.user);
    const language = useSelector((state) => state.tiktak.language);
    const theme = useSelector((state) => state.tiktak.theme);
    useEffect(() => {
        const token = localStorage.getItem("jwt-token");
        if (!user && token) {
            try {
                dispatch(login(jwtDecode(token)));
            } catch (err) {
                toast.error(err.message);
            }
        }
    }, []);
    return (
        <div
            id="header"
            style={{
                "--bgc": theme.bgc,
                "--weak": theme.weak,
                "--strong": theme.strong,
                "--strong-fade": `${theme.strong}1A`,
                "--highlight": theme.highlight,
            }}
            onClick={() => {
                setUserSettings(false);
                setIsSandbox(false);
            }}
        >
            <div className="userStaff">
                {user && (
                    <>
                        <div className="menus">
                            <button
                                style={
                                    userSettings
                                        ? {
                                              transform: "scale(1.1)",
                                          }
                                        : {}
                                }
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setUserSettings(!userSettings);
                                    setIsSandbox(false);
                                }}
                            >
                                <img
                                    src={user.image.src}
                                    alt={
                                        user.image.alt
                                            ? user.image.alt
                                            : "Profile picture of " +
                                              user.username
                                    }
                                />
                            </button>
                            <button
                                className={isSandbox ? "sandboxActive" : ""}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setUserSettings(false);
                                    setIsSandbox(!isSandbox);
                                }}
                            >
                                <i className="bi bi-bell"></i>
                            </button>
                        </div>
                        {isSandbox && user && <SandboxSmall user={user} />}
                        {userSettings && (
                            <ul>
                                <li>
                                    <div>
                                        <img
                                            src={user.image.src}
                                            alt={
                                                user.image.alt
                                                    ? user.image.alt
                                                    : "Profile picture of " +
                                                      user.username
                                            }
                                        />
                                        <h1>
                                            {`${user.name.firstName} ${user.name.lastName}`}
                                        </h1>
                                    </div>
                                    <hr />
                                    <h4>
                                        {language === "HE"
                                            ? "להציג משתמש"
                                            : "See account"}
                                        <i className="bi bi-arrow-up-short"></i>
                                    </h4>
                                </li>
                                <li>
                                    <Link to="/settings">
                                        <i className="bi bi-gear-fill"></i>
                                        <h1>
                                            {language === "HE"
                                                ? "הגדרות ופרטיות"
                                                : "Settings & privacy"}
                                        </h1>
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/help">
                                        <i className="bi bi-question-circle-fill"></i>
                                        <h1>
                                            {language === "HE"
                                                ? "עזרה"
                                                : "help"}
                                        </h1>
                                    </Link>
                                </li>
                                <li
                                    onClick={() => {
                                        dispatch(logout());
                                        localStorage.removeItem("jwt-token");
                                        window.location.reload();
                                    }}
                                >
                                    <i className="bi bi-box-arrow-right"></i>
                                    <h1>
                                        {language === "HE" ? "התנתק" : "Logout"}
                                    </h1>
                                </li>
                            </ul>
                        )}
                    </>
                )}
                {!user && (
                    <div className="auth">
                        <Link to="/signup">
                            <button>
                                {language === "HE" ? "הרשמה" : "Signup"}
                            </button>
                        </Link>
                        <Link to="/login">
                            <button>
                                {language === "HE" ? "התחבר" : "Login"}
                            </button>
                        </Link>
                    </div>
                )}
            </div>
            {user && (
                <nav>
                    <ul>
                        <li>
                            <Link
                                className={
                                    location.pathname === "/" ? "current" : ""
                                }
                            >
                                <i className="bi bi-house"></i>
                                <h4>
                                    {" "}
                                    {language === "HE" ? "דף הבית" : "Home"}
                                </h4>
                            </Link>
                        </li>
                        <li>
                            <Link
                                className={
                                    location.pathname === "/friends"
                                        ? "current"
                                        : ""
                                }
                            >
                                <i className="bi bi-people"></i>
                                <h4>
                                    {" "}
                                    {language === "HE" ? "חברים" : "Friends"}
                                </h4>
                            </Link>
                        </li>
                        <li>
                            <Link
                                className={
                                    location.pathname === "/search"
                                        ? "current"
                                        : ""
                                }
                            >
                                <i className="bi bi-search"></i>
                                <h4>
                                    {language === "HE" ? "חיפוש" : "Search"}
                                </h4>
                            </Link>
                        </li>
                    </ul>
                </nav>
            )}
            <div className="search">
                <img src={logo} alt="Tiktak logo" />
                <datalist id="posts"></datalist>
            </div>
        </div>
    );
};

export default Header;
