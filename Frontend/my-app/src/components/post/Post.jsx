import React, { useEffect, useState } from "react";
import "./post.css";
import { useDispatch, useSelector } from "react-redux";
import useApi, { METHOD } from "../../hooks/useApi";
import Messages from "./Messages";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { verifySandbox } from "../../guard";
import { setDisplayRefreshBtn } from "../TiktakSlice";
import EditPost from "../editPost/EditPost";

const Post = ({ post }) => {
    const language = useSelector((state) => state.tiktak.language);
    const user = useSelector((state) => state.tiktak.user);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [errors, setErrors, isLoading, apiResponse, callApi] = useApi();
    const [users, setUsers] = useState(null);
    const [messages, setMessages] = useState([]);
    const [method, setMethod] = useState(null);
    const [isImageValid, setIsImageValid] = useState(false);
    const [p, setP] = useState(post);
    const [displayDeletePost, setDisplayDeletePost] = useState(false);
    const [displayEditPost, setDisplayEditPost] = useState(false);

    useEffect(() => {
        if (apiResponse && !errors && method === "DELETE POST") {
            setDisplayDeletePost(false);
            dispatch(setDisplayRefreshBtn());
            setMethod(null);
        }
        if (apiResponse && !errors && method === "GET ALL USERS") {
            setUsers(apiResponse);
            setMethod(null);
        }
        if (apiResponse && !errors && method === "TOGGLE LIKE POST") {
            if (p.likes.length < apiResponse.likes.length) {
                addToSandbox({
                    content: {
                        en: `${user.username} liked your post`,
                        he: `${user.username} עשה לייק`,
                    },
                });
            }
            setP(apiResponse);
            setMethod(null);
        }
        if (apiResponse && !errors && method === "ADD TO SANDBOX") {
            setMethod(null);
        }
    }, [method, apiResponse, errors]);

    useEffect(() => {
        const fetchData = async () => {
            await callApi("http://localhost:9999/users");
            setMethod("GET ALL USERS");
        };
        fetchData();
    }, []);
    const checkIfLiked = (post) => {
        if (user && post) {
            for (let i = 0; i < post.likes.length; i++) {
                if (post.likes[i].toString() === user._id.toString()) {
                    return true;
                }
            }
            return false;
        } else {
            return false;
        }
    };
    const handleToggleLikePost = async (post) => {
        await callApi(
            `http://localhost:9999/posts/${post._id.toString()}`,
            METHOD.PATCH,
            null,
            { authorization: localStorage.getItem("jwt-token") }
        );
        setMethod("TOGGLE LIKE POST");
    };
    const isValidImageUrl = async (url) => {
        return new Promise((resolve) => {
            const img = new Image();

            img.onload = () => resolve(true);
            img.onerror = () => resolve(false);

            img.src = url;
            setTimeout(() => resolve(false), 5000);
        });
    };
    useEffect(() => {
        if (p) {
            const checkImage = async () => {
                const valid = await isValidImageUrl(p.image?.src);
                setIsImageValid(valid);
            };
            if (p.image?.src) checkImage();
        }
    }, [p]);
    const addToSandbox = async (message) => {
        const verify = verifySandbox(message);
        if (!verify.valid) {
            toast.error(
                language === "HE" ? verify.message.he : verify.message.en
            );
            return;
        }
        callApi(
            `http://localhost:9999/users/sandbox/${p.user_id}`,
            METHOD.POST,
            message,
            { authorization: localStorage.getItem("jwt-token") }
        );
        setMethod("ADD TO SANDBOX");
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
    const handleDeletePost = async (p) => {
        const token = localStorage.getItem("jwt-token");
        if (token) {
            await callApi(
                `http://localhost:9999/posts/${p._id}`,
                METHOD.DELETE,
                null,
                {
                    authorization: token,
                }
            );
            setMethod("DELETE POST");
        }
    };
    return (
        <div id="post" key={p ? p._id : ""}>
            {displayDeletePost && post && (
                <div id="deletePostWrapper">
                    <div>
                        <h1>
                            {language === "HE"
                                ? "האם אתה בטוח שאתה רוצה למחוק את הפוסט הזה?"
                                : "Are you sure you want to delete this post?"}
                        </h1>
                        <h2>
                            {language === "HE"
                                ? "אי אפשר לחזור על התהליך הזה."
                                : "This proccess canot be undone."}
                        </h2>
                        <div>
                            <button
                                onClick={() => {
                                    handleDeletePost(post);
                                }}
                            >
                                {language === "HE" ? "מחק פוסט" : "Delete post"}
                            </button>
                            <button
                                onClick={() => {
                                    setDisplayDeletePost(false);
                                }}
                            >
                                {language === "HE" ? "סגור" : "Cancel"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {displayEditPost && (
                <EditPost post={post} setDisplayEditPost={setDisplayEditPost} />
            )}
            {users && p && (
                <div>
                    <div className="postHeader">
                        <div>
                            <div>
                                <img
                                    src={
                                        users.filter(
                                            (u) =>
                                                u._id.toString() ===
                                                p.user_id.toString()
                                        )[0].image?.src
                                    }
                                    alt="image"
                                />
                                <h1
                                    className="usernameLink"
                                    onClick={() => {
                                        navigate(
                                            `/user-profile/${
                                                users.filter(
                                                    (u) =>
                                                        u._id.toString() ===
                                                        p.user_id.toString()
                                                )[0]._id
                                            }/posts`
                                        );
                                    }}
                                >
                                    {
                                        users.filter(
                                            (u) =>
                                                u._id.toString() ===
                                                p.user_id.toString()
                                        )[0]?.username
                                    }
                                </h1>
                                <h4>{getRelativeTime(p.createdAt)}</h4>
                            </div>
                            <div>
                                <h1
                                    style={{ cursor: "pointer" }}
                                    onClick={() => {
                                        navigate(`/posts/${p._id}`);
                                    }}
                                >
                                    {p.title}
                                </h1>
                                <h4
                                    style={{ cursor: "pointer" }}
                                    onClick={() => {
                                        navigate(`/posts/${p._id}`);
                                    }}
                                >
                                    {p.subtitle}
                                </h4>
                            </div>
                        </div>
                    </div>
                    <div className="postBody">
                        {p.image.src && isImageValid && (
                            <div
                                style={{ cursor: "pointer" }}
                                onClick={() => {
                                    navigate(`/posts/${p._id}`);
                                }}
                            >
                                {p.image?.src && (
                                    <img src={p.image?.src} alt="Image" />
                                )}
                            </div>
                        )}
                        <p>{p.content}</p>
                    </div>
                    <div className="postSocial">
                        <div>
                            <span>
                                {checkIfLiked(p) ? (
                                    <i className="bi bi-hand-thumbs-up-fill"></i>
                                ) : (
                                    <i className="bi bi-hand-thumbs-up"></i>
                                )}
                                {p.likes.length}
                            </span>
                            <span>
                                {messages &&
                                    messages.filter(
                                        (m) =>
                                            m.post_id.toString() ===
                                            p._id.toString()
                                    ).length}
                                <h2>
                                    {language === "HE" ? "הודעות" : "Comments"}
                                </h2>
                            </span>
                        </div>
                        <hr />
                        {p && (
                            <>
                                <Messages
                                    addToSandbox={addToSandbox}
                                    user={user}
                                    setMessagesParent={setMessages}
                                    handleToggleLikePost={handleToggleLikePost}
                                    checkIfLiked={checkIfLiked}
                                    post={p}
                                    setDisplayDeletePost={setDisplayDeletePost}
                                    setDisplayEditPost={setDisplayEditPost}
                                />
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Post;
