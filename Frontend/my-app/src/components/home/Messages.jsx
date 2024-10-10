import React, { useEffect, useState } from "react";
import "./messages.css";
import { useSelector } from "react-redux";
import useApi from "../../hooks/useApi";
import { Link } from "react-router-dom";

const Messages = ({ postId }) => {
    const language = useSelector((state) => state.tiktak.language);
    const theme = useSelector((state) => state.tiktak.theme);

    const [messages, setMessages] = useState(null);
    const [users, setUsers] = useState(null);
    const [errors, setErrors, isLoading, apiResponse, callApi] = useApi();
    const [method, setMethod] = useState(null);

    useEffect(() => {
        const fetchMessages = async () => {
            await callApi(
                `http://localhost:9999/messages/post-messages/${postId}`
            );
            setMethod("GET ALL MESSAGES");
        };
        fetchMessages();
    }, []);
    useEffect(() => {
        if (apiResponse && !errors && method === "GET ALL MESSAGES") {
            setMessages(apiResponse);
            setMethod(null);
        }
        if (apiResponse && !errors && method === "GET ALL USERS") {
            setUsers(apiResponse);
            setMethod(null);
        }
    }, [method]);
    useEffect(() => {
        if (messages) {
            const fetchMessages = async () => {
                await callApi("http://localhost:9999/users");
                setMethod("GET ALL USERS");
            };
            fetchMessages();
        }
    }, [messages]);
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
            id="messages"
            style={{
                "--bgc": theme.bgc,
                "--weak": theme.weak,
                "--strong-fade": `${theme.strong}4D`,
                "--strong": theme.strong,
                "--highlight": theme.highlight_weak,
                "--highlight_strong": theme.highlight_strong,
            }}
        >
            {messages && users && (
                <div>
                    <ul>
                        {messages &&
                            messages.map((m) => (
                                <li key={m._id}>
                                    <img
                                        src={
                                            users.filter(
                                                (u) =>
                                                    u._id.toString() ===
                                                    m.user_id.toString()
                                            )[0].image?.src
                                        }
                                        alt="Image"
                                    />
                                    <div>
                                        <h1>
                                            {
                                                users.filter(
                                                    (u) =>
                                                        u._id.toString() ===
                                                        m.user_id.toString()
                                                )[0].username
                                            }
                                        </h1>
                                        <p>{m.content}</p>
                                    </div>
                                    <div>
                                        <h1>{getRelativeTime(m.createdAt)}</h1>
                                        <button>
                                            {language === "HE"
                                                ? "לייק"
                                                : "Like"}
                                        </button>
                                    </div>
                                </li>
                            ))}
                        {messages && messages.length < 1 && (
                            <h1>
                                {language === "HE"
                                    ? "אין תגובות לפוסט..."
                                    : "No comments to this post..."}
                            </h1>
                        )}
                    </ul>
                    <hr />
                    <div>
                        <input
                            type="text"
                            placeholder={
                                language === "HE"
                                    ? "כתיבת תגובה ציבורית..."
                                    : "Add public comment..."
                            }
                        />
                        <button>
                            <i className="bi bi-send"></i>
                        </button>
                        <Link>
                            <button>
                                {language === "HE"
                                    ? "לכל התגובות"
                                    : "To all comments"}
                            </button>
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Messages;
