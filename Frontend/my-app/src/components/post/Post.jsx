import React, { useEffect, useState } from "react";
import "./post.css";
import { useSelector } from "react-redux";
import useApi, { METHOD } from "../../hooks/useApi";
import Messages from "./Messages";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { verifySandbox } from "../../guard";

const Post = ({ post }) => {
    const language = useSelector((state) => state.tiktak.language);
    const user = useSelector((state) => state.tiktak.user);
    const navigate = useNavigate();

    const [errors, setErrors, isLoading, apiResponse, callApi] = useApi();
    const [users, setUsers] = useState(null);
    const [messages, setMessages] = useState(null);
    const [method, setMethod] = useState(null);
    const [isImageValid, setIsImageValid] = useState(false);
    const [p, setP] = useState(post);

    useEffect(() => {
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
                    image: user.image.src,
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
            message
        );
        setMethod("ADD TO SANDBOX");
    };
    return (
        <div id="post" key={p ? p._id : ""}>
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
                            </div>
                            <div>
                                <h1>{p.title}</h1>
                                <h4>{p.subtitle}</h4>
                            </div>
                        </div>
                    </div>
                    <div className="postBody">
                        {p.image.src && isImageValid && (
                            <div>
                                {p.image?.src && (
                                    <img src={p.image?.src} alt="Image" />
                                )}
                                {p.video?.src && !p.image?.src && (
                                    <video src={p.video?.src}></video>
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
                                    user={user}
                                    setMessagesParent={setMessages}
                                    handleToggleLikePost={handleToggleLikePost}
                                    checkIfLiked={checkIfLiked}
                                    post={p}
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
