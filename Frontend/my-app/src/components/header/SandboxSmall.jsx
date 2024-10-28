import React, { useEffect, useState } from "react";
import "./sandboxSmall.css";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import useApi from "../../hooks/useApi";
import chick from "../../media/images/chick.png";

const SandboxSmall = ({ user }) => {
    const language = useSelector((state) => state.tiktak.language);
    const theme = useSelector((state) => state.tiktak.theme);
    const navigate = useNavigate();
    const [errors, setErrors, isLoading, apiResponse, callApi] = useApi();
    const [messages, setMessages] = useState(null);
    useEffect(() => {
        if (user) {
            callApi("http://localhost:9999/users/" + user._id);
        }
    }, []);
    useEffect(() => {
        if (apiResponse && apiResponse.sandbox) {
            setMessages(apiResponse.sandbox.reverse());
        }
    }, [apiResponse, errors]);
    const getRelativeTime = (timestamp) => {
        const now = new Date();
        const date = new Date(timestamp);
        const seconds = Math.floor((now - date) / 1000);

        const intervals = [
            { unit: "year", seconds: 31536000 },
            { unit: "month", seconds: 2592000 },
            { unit: "week", seconds: 604800 },
            { unit: "day", seconds: 86400 },
            { unit: "hour", seconds: 3600 },
            { unit: "minute", seconds: 60 },
            { unit: "second", seconds: 1 },
        ];

        for (const { unit, seconds: intervalSeconds } of intervals) {
            const count = Math.floor(seconds / intervalSeconds);
            if (count > 0) {
                const rtf = new Intl.RelativeTimeFormat("en", {
                    numeric: "auto",
                });
                return rtf.format(-count, unit);
            }
        }
        return "just now";
    };
    return (
        <div
            id="smallSandbox"
            style={{
                "--bgc": theme.bgc,
                "--weak": theme.weak,
                "--strong": theme.strong,
                "--strong-fade": `${theme.strong}1A`,
                "--highlight": theme.highlight,
            }}
        >
            <h1>{language === "HE" ? "עדכונים" : "Notifications"}</h1>
            <ul>
                {messages &&
                    messages.map((m) => (
                        <li key={m._id}>
                            <div>
                                <img src={m.image} alt="Profile picture" />
                                <p>
                                    {m.content.he && language === "HE"
                                        ? m.content.he
                                        : m.content.en
                                        ? m.content.en
                                        : m.content}
                                </p>
                            </div>
                            <h4>{getRelativeTime(m.createdAt)}</h4>
                        </li>
                    ))}
                {messages && messages.length < 1 && (
                    <div className="noMessages">
                        <h1>
                            {language === "HE"
                                ? "תיבת הדואר ריקה..."
                                : "Sandbox is empty..."}
                        </h1>
                        <img src={chick} alt="chick image" />
                    </div>
                )}
            </ul>
            <button
                onClick={() => {
                    navigate("/sandbox");
                }}
            >
                {language === "HE" ? "כל ההודעות" : "All messages"}
            </button>
        </div>
    );
};

export default SandboxSmall;
