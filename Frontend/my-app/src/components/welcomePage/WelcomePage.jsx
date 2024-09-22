import React from "react";
import "./welcomePage.css";
import { useSelector } from "react-redux";

const WelcomePage = () => {
    const language = useSelector((state) => state.tiktak.language);
    const theme = useSelector((state) => state.tiktak.theme);

    return (
        <div id="welcomeDiv">
            <div style={{ direction: language == "HE" ? "rtl" : "ltr" }}>
                <div>
                    <h1>Tiktak</h1>
                    <form>
                        <label htmlFor="email">
                            {language == "HE" ? "אימייל" : "Email"}
                        </label>
                        <input type="email" id="email" />
                        <label htmlFor="password">
                            {language == "HE" ? "סיסמה" : "Password"}
                        </label>
                        <input type="password" id="password" />
                        <input
                            style={{
                                "--background-color": theme.highlight_weak,
                                "--hover-background-color":
                                    theme.highlight_strong,
                            }}
                            type="button"
                            value={language == "HE" ? "התחבר/י" : "Conact"}
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
