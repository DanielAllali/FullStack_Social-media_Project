import React, { useEffect, useState } from "react";
import "./settings.css";
import { useDispatch, useSelector } from "react-redux";
import { setDisplayRefreshBtn } from "../TiktakSlice";
import toast from "react-hot-toast";

const Theme = () => {
    const language = useSelector((state) => state.tiktak.language);
    const dispatch = useDispatch();

    const [themes, setThemes] = useState([
        "light",
        "dark",
        "lightCrimson",
        "darkCrimson",
        "lightPink",
        "darkPink",
    ]);
    useEffect(() => {
        const currentTheme = localStorage.getItem("Theme");
        setThemes([currentTheme, ...themes.filter((t) => t != currentTheme)]);
    }, []);
    const handleChangeTheme = (theme) => {
        if (localStorage.getItem("Theme") !== theme) {
            localStorage.setItem("Theme", theme);
            dispatch(setDisplayRefreshBtn());
            toast.success(
                language === "HE"
                    ? "בצבע השתנה בהצלחה, עדכן את הדף."
                    : "Your theme changed succussfuly, refresh the page."
            );
        } else {
            toast(
                language === "HE"
                    ? "אתה כבר בצבע הזה"
                    : "Your already on this theme",
                {
                    icon: "❌",
                }
            );
        }
    };
    return (
        <div className="tab themeTab">
            <h1>{language === "HE" ? "בחר צבע" : "Choose theme"}</h1>
            <div>
                <ul>
                    {themes.map((t) => (
                        <li
                            onClick={() => {
                                handleChangeTheme(t);
                            }}
                            key={t}
                            className={t}
                        ></li>
                    ))}
                </ul>
            </div>
            <button
                onClick={() => {
                    handleChangeTheme("light");
                }}
            >
                {language === "HE" ? "אתחל" : "Reset"}
            </button>
        </div>
    );
};

export default Theme;
