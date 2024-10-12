import React, { useEffect, useRef, useState } from "react";
import "./messages.css";
import { useSelector } from "react-redux";
import useApi, { METHOD } from "../../hooks/useApi";
import { Link } from "react-router-dom";
import { verifyMessageContent } from "../../guard";

const Messages = ({ post, handleToggleLikePost, checkIfLiked }) => {
    const language = useSelector((state) => state.tiktak.language);
    const theme = useSelector((state) => state.tiktak.theme);

    const [messages, setMessages] = useState(null);
    const [messagesSmall, setMessagesSmall] = useState(null);
    const [messagesPopup, setMessagesPopup] = useState(false);
    const [users, setUsers] = useState(null);
    const [errors, setErrors, isLoading, apiResponse, callApi] = useApi();
    const [method, setMethod] = useState(null);
    const [messageContent, setMessageContent] = useState("");
    const [inputError, setInputError] = useState(null);
    const inputRef = useRef(null);

    useEffect(() => {
        const fetchMessages = async () => {
            await callApi(
                `http://localhost:9999/messages/post-messages/${post._id.toString()}`
            );
            setMethod("GET ALL MESSAGES");
        };
        fetchMessages();
    }, []);
    useEffect(() => {
        if (apiResponse && !errors && method === "GET ALL MESSAGES") {
            setMessages(apiResponse.filter((m) => !m.deleted));
            setMethod(null);
        }
        if (apiResponse && !errors && method === "GET ALL USERS") {
            setUsers(apiResponse);
            setMethod(null);
        }
        if (apiResponse && !errors && method === "ADD COMMENT") {
            const updatedMessages = [...messages, apiResponse];
            setMessages(updatedMessages);
        }
    }, [method, errors, apiResponse]);
    useEffect(() => {
        if (messages) {
            const newMessages = messages.reverse();
            setMessagesSmall(
                newMessages[0] && newMessages[1]
                    ? [newMessages[0], newMessages[1]]
                    : newMessages[0]
                    ? [newMessages[0]]
                    : []
            );

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
    const handleAddComment = async (post, comment) => {
        setInputError(verifyMessageContent(messageContent));
        if (!verifyMessageContent(messageContent)) {
            await callApi(
                `http://localhost:9999/messages/${post._id.toString()}`,
                METHOD.POST,
                { content: comment },
                { authorization: localStorage.getItem("jwt-token") }
            );
            setMethod("ADD COMMENT");
        }
    };
    const commentClicked = () => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    };
    return (
        <>
            <div className="likeComment">
                <button
                    onClick={() => {
                        handleToggleLikePost(post);
                    }}
                >
                    {checkIfLiked(post)
                        ? language === "HE"
                            ? "להסיר לייק"
                            : "Unlike"
                        : language === "HE"
                        ? "לייק"
                        : "Like"}
                    <i className="bi bi-hand-thumbs-up"></i>
                </button>
                <button onClick={commentClicked}>
                    {language === "HE" ? "הודעה" : "Comment"}
                    <i className="bi bi-chat"></i>
                </button>
            </div>
            <hr />
            <div
                id="messages"
                style={{
                    "--bgc": theme.bgc,
                    "--weak": theme.weak,
                    "--weak-fade": `${theme.weak}4D`,
                    "--strong-fade": `${theme.strong}4D`,
                    "--strong": theme.strong,
                    "--highlight": theme.highlight_weak,
                    "--highlight_strong": theme.highlight_strong,
                }}
            >
                {messagesSmall && messages && users && (
                    <div>
                        <ul>
                            {messagesSmall &&
                                messagesSmall.reverse().map((m) => (
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
                                            <h1>
                                                {getRelativeTime(m.createdAt)}
                                            </h1>
                                            <button>
                                                {language === "HE"
                                                    ? "לייק"
                                                    : "Like"}
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            {messages && messages.length > 2 && (
                                <i
                                    style={{ fontSize: "2rem" }}
                                    className="bi bi-three-dots"
                                ></i>
                            )}
                            {messages && messages.length < 1 && (
                                <h1>
                                    {language === "HE"
                                        ? "אין תגובות לפוסט..."
                                        : "No comments to this post..."}
                                </h1>
                            )}
                        </ul>
                        <div>
                            <div>
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={messageContent}
                                    onChange={(e) => {
                                        setMessageContent(e.target.value);
                                        setInputError(
                                            verifyMessageContent(e.target.value)
                                        );
                                    }}
                                    placeholder={
                                        language === "HE"
                                            ? "כתיבת תגובה ציבורית..."
                                            : "Add public comment..."
                                    }
                                />
                                {inputError && (
                                    <h2>
                                        {language === "HE"
                                            ? inputError.he
                                            : inputError.en}
                                    </h2>
                                )}
                            </div>
                            <button
                                onClick={() => {
                                    handleAddComment(post, messageContent);
                                }}
                            >
                                <i className="bi bi-send"></i>
                            </button>
                            <Link>
                                <button
                                    onClick={() => {
                                        setMessagesPopup(true);
                                    }}
                                >
                                    {language === "HE"
                                        ? "לכל התגובות"
                                        : "To all comments"}
                                </button>
                            </Link>
                        </div>
                    </div>
                )}
                {messagesPopup && (
                    <div className="messagesWrapper">
                        <div>
                            <h1>{language === "HE" ? "הודעות" : "Comments"}</h1>
                            <ul>
                                {messages &&
                                    messages.reverse().map((m) => (
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
                                                <h1>
                                                    {getRelativeTime(
                                                        m.createdAt
                                                    )}
                                                </h1>
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
                            <button
                                onClick={() => {
                                    setMessagesPopup(false);
                                }}
                            >
                                <i className="bi bi-x-lg"></i>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default Messages;
