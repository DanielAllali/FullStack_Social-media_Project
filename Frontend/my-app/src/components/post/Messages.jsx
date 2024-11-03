import React, { useEffect, useRef, useState } from "react";
import "./messages.css";
import { useSelector } from "react-redux";
import useApi, { METHOD } from "../../hooks/useApi";
import { Link, useNavigate } from "react-router-dom";
import { verifyMessageContent } from "../../guard";
import toast from "react-hot-toast";
import Loader from "../loader/Loader.jsx";

const Messages = ({
    post,
    handleToggleLikePost,
    checkIfLiked,
    setMessagesParent,
    user,
    addToSandbox,
    setDisplayDeletePost,
    setDisplayEditPost,
}) => {
    const language = useSelector((state) => state.tiktak.language);
    const theme = useSelector((state) => state.tiktak.theme);

    const navigate = useNavigate();
    const [fullUser, setFullUser] = useState(null);
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
        const fetchData = async () => {
            if (!users && method === null) {
                await callApi("http://localhost:9999/users");
                setMethod("GET ALL USERS");
            }
        };
        fetchData();
        if (user && method === null) {
            updateFullUser();
        }
    }, []);
    useEffect(() => {
        const fetchData = async () => {
            if (!messages) {
                await callApi("http://localhost:9999/messages");
                setMethod("GET ALL MESSAGES");
            }
        };
        fetchData();
    }, [users]);

    useEffect(() => {
        if (messages && messages.length > 0) {
            const lastIndex = messages.length - 1;
            let newMessages = [...messages];
            if (
                new Date(messages[0].createdAt) <
                new Date(messages[lastIndex].createdAt)
            ) {
                newMessages.reverse();
            }
        }
        if (messages) {
            setMessagesSmall(messages.slice(0, 2));
        }
    }, [messages]);
    useEffect(() => {
        if (apiResponse && !errors && method === "GET ALL USERS") {
            if (apiResponse.length > 0 && apiResponse[0].username) {
                setUsers(apiResponse);
            }
            setMethod(null);
        }
        if (apiResponse && !errors && method === "GET ALL MESSAGES") {
            if (apiResponse.length > 0 && apiResponse[0].content) {
                setMessages(
                    apiResponse.filter(
                        (m) => m.post_id === post._id && !m.deleted
                    )
                );
                setMessagesParent(apiResponse);
            }
            setMethod(null);
        }
        if (apiResponse && !errors && method === "ADD COMMENT") {
            addToSandbox({
                content: {
                    en: `${user.username} commented on your post`,
                    he: `${user.username} הגיב לפוסט שלך`,
                },
            });
            const updatedMessages = [...messages, apiResponse];
            setMessages(updatedMessages);
            setMessagesParent((prevMessages) => [...prevMessages, apiResponse]);
        }
        if (apiResponse && !errors && method === "GET FULL USER") {
            if (apiResponse.username) {
                setFullUser(apiResponse);
                setMethod(null);
            }
        }
        if (apiResponse && !errors && method === "TOGGLE SAVE POST") {
            updateFullUser();
        }
    }, [method, errors, apiResponse]);

    const updateFullUser = async () => {
        await callApi(`http://localhost:9999/users/${user._id}`);
        setMethod("GET FULL USER");
    };
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

        const locale = language === "HE" ? "he" : "en";

        for (const { unit, seconds: intervalSeconds } of intervals) {
            const count = Math.floor(seconds / intervalSeconds);
            if (count > 0) {
                const rtf = new Intl.RelativeTimeFormat(locale, {
                    numeric: "auto",
                });
                return rtf.format(-count, unit);
            }
        }

        return language === "HE" ? "הרגע" : "just now";
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
    const handleToggleSavePost = async () => {
        if (user) {
            await callApi(
                `http://localhost:9999/users/save-post/${post._id}`,
                METHOD.PATCH,
                null,
                { Authorization: localStorage.getItem("jwt-token") }
            );
            setMethod("TOGGLE SAVE POST");
        } else {
            toast.error("Login/Signup to save post.");
        }
    };
    const checkIfSaved = () => {
        if (fullUser) {
            for (const p of fullUser.saved_posts) {
                if (p === post._id.toString()) {
                    return true;
                }
            }
        }
        return false;
    };

    const handleToggleLikeComment = async (m) => {
        const token = localStorage.getItem("jwt-token");
        if (token) {
            await callApi(
                `http://localhost:9999/messages/${m._id}`,
                METHOD.PATCH,
                null,
                {
                    authorization: token,
                }
            );
            setMessages((prevMessages) => {
                const updatedMessages = prevMessages.map((msg) => {
                    if (msg._id === m._id) {
                        const isLiked = checkIfCommentLiked(msg);
                        const newLikes = isLiked
                            ? msg.likes.filter((id) => id !== user._id)
                            : [...msg.likes, user._id];
                        return { ...msg, likes: newLikes };
                    }
                    return msg;
                });
                return updatedMessages;
            });
        }
    };

    const checkIfCommentLiked = (m) => {
        if (user && m) {
            return m.likes.some(
                (likeId) => likeId.toString() === user._id.toString()
            );
        }
        return false;
    };

    return (
        <>
            {!users || !messages || !messagesSmall ? (
                <h1>
                    {language === "HE"
                        ? "משהו השתבש, תרענן את הדף"
                        : "Something went wrong, refresh the page."}
                </h1>
            ) : (
                <></>
            )}
            {user && (
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
                            {checkIfLiked(post) ? (
                                <i className="bi bi-hand-thumbs-up-fill"></i>
                            ) : (
                                <i className="bi bi-hand-thumbs-up"></i>
                            )}
                        </button>
                        <button onClick={commentClicked}>
                            {language === "HE" ? "הודעה" : "Comment"}
                            <i className="bi bi-chat"></i>
                        </button>
                        <button onClick={handleToggleSavePost}>
                            {!checkIfSaved()
                                ? language === "HE"
                                    ? "שמור"
                                    : "Save"
                                : language === "HE"
                                ? "הסר משמורים"
                                : "Unsave"}
                            {!checkIfSaved() && (
                                <i className="bi bi-bookmark-plus"></i>
                            )}
                            {checkIfSaved() && (
                                <i className="bi bi-bookmark-dash-fill"></i>
                            )}
                        </button>
                        {user._id.toString() === post.user_id.toString() ||
                        user.isAdmin ? (
                            <>
                                <button
                                    onClick={() => {
                                        setDisplayEditPost(true);
                                    }}
                                >
                                    {language === "HE" ? "ערוך" : "Edit"}
                                    <i className="bi bi-pencil-square"></i>
                                </button>
                                <button
                                    onClick={() => {
                                        setDisplayDeletePost(true);
                                    }}
                                >
                                    {language === "HE" ? "מחק" : "Delete"}
                                    <i className="bi bi-trash3"></i>
                                </button>
                            </>
                        ) : (
                            <></>
                        )}
                    </div>
                    <hr />
                </>
            )}
            {!user && (
                <button
                    className="noUserBtn"
                    onClick={() => {
                        navigate("/signup");
                    }}
                >
                    {language === "HE"
                        ? "התחברות/הרשמה בשביל לעשות לייק להגיב ועוד..."
                        : "Login/Signup to like/comment etc..."}
                </button>
            )}

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
                {isLoading && <Loader size={100} />}
                {messagesSmall && messages && users && (
                    <div>
                        <ul>
                            {messagesSmall.reverse().map((m) => (
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
                                        <h1
                                            className="userH1"
                                            onClick={() => {
                                                navigate(
                                                    `/user-profile/${users
                                                        .filter(
                                                            (u) =>
                                                                u._id.toString() ===
                                                                m.user_id.toString()
                                                        )[0]
                                                        ._id.toString()}/posts`
                                                );
                                            }}
                                        >
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
                                        <button
                                            onClick={() => {
                                                handleToggleLikeComment(m);
                                            }}
                                        >
                                            {checkIfCommentLiked(m)
                                                ? language === "HE"
                                                    ? "הסר לייק"
                                                    : "Unlike"
                                                : language === "HE"
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
                            {user && (
                                <div className="inputAndSend">
                                    <div>
                                        <input
                                            ref={inputRef}
                                            type="text"
                                            value={messageContent}
                                            onChange={(e) => {
                                                setMessageContent(
                                                    e.target.value
                                                );
                                                setInputError(
                                                    verifyMessageContent(
                                                        e.target.value
                                                    )
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
                                            handleAddComment(
                                                post,
                                                messageContent
                                            );
                                        }}
                                    >
                                        <i className="bi bi-send"></i>
                                    </button>
                                </div>
                            )}
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
                                                <button
                                                    onClick={() => {
                                                        handleToggleLikeComment(
                                                            m
                                                        );
                                                    }}
                                                >
                                                    {checkIfCommentLiked(m)
                                                        ? language === "HE"
                                                            ? "הסר לייק"
                                                            : "Unlike"
                                                        : language === "HE"
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
