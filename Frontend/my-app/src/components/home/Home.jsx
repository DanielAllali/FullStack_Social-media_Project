import React, { useEffect, useState } from "react";
import "./home.css";
import { jwtDecode } from "jwt-decode";
import { useSelector } from "react-redux";
import SignupPopup from "./SignupPopup";
import Footer from "../footer/Footer";
import Header from "../header/Header";
import useApi, { METHOD } from "../../hooks/useApi";
import Messages from "./Messages";
import CreatePost from "../createPost/CreatePost";
import RefreshBtn from "../refreshBtn/RefreshBtn";

const Home = () => {
    const language = useSelector((state) => state.tiktak.language);

    const [createPostPopup, setCreatePostPopup] = useState(false);
    const [signupPopup, setSignupPopup] = useState(false);
    const [user, setUser] = useState(null);
    const [errors, setErrors, isLoading, apiResponse, callApi] = useApi();
    const [posts, setPosts] = useState(null);
    const [users, setUsers] = useState(null);
    const [messages, setMessages] = useState(null);
    const [displayRefreshBtn, setDisplayRefreshBtn] = useState(false);
    const [method, setMethod] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("jwt-token");
        if (token) {
            const { exp } = jwtDecode(token);
            const currentTime = Math.floor(Date.now() / 1000);
            if (!(exp < currentTime)) {
                setUser(jwtDecode(token));
            } else {
                localStorage.removeItem("jwt-token");
            }
        } else {
            setSignupPopup(true);
        }
        const fetchPosts = async () => {
            await callApi("http://localhost:9999/posts");
            setMethod("GET ALL POSTS");
        };
        fetchPosts();
    }, []);
    useEffect(() => {
        if (apiResponse && !errors && method === "GET ALL POSTS") {
            setPosts(apiResponse.filter((p) => !p.deleted));
            setMethod(null);
        }
        if (apiResponse && !errors && method === "GET ALL USERS") {
            setUsers(apiResponse);
            setMethod(null);
        }
        if (apiResponse && !errors && method === "TOGGLE LIKE POST") {
            const updatedPost = apiResponse;
            setPosts((prevPosts) =>
                prevPosts.map((p) =>
                    p._id.toString() === updatedPost._id.toString()
                        ? updatedPost
                        : p
                )
            );
        }
    }, [method]);
    useEffect(() => {
        if (posts) {
            const fetchPosts = async () => {
                await callApi("http://localhost:9999/users");
                setMethod("GET ALL USERS");
            };
            fetchPosts();
        }
    }, [posts]);
    const checkIfLiked = (post) => {
        for (let i = 0; i < post.likes.length; i++) {
            if (post.likes[i].toString() === user._id.toString()) {
                return true;
            }
        }
        return false;
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

    return (
        <div id="home">
            <Header />
            {signupPopup && <SignupPopup setIsDisplay={setSignupPopup} />}
            {displayRefreshBtn && <RefreshBtn />}
            <div className="content">
                {user && (
                    <div className="createPost">
                        <div>
                            <img
                                src={user.image.src}
                                alt={`${user.username} image`}
                            />
                            <button
                                onClick={() => {
                                    setCreatePostPopup(true);
                                }}
                            >
                                {language === "HE"
                                    ? `צור פוסט חדש ${user.username}!`
                                    : `Create new post ${user.username}!`}
                            </button>
                        </div>
                        <hr />
                        <div>
                            <h1>
                                {language === "HE" ? "סרטון" : "Video"}
                                <i className="bi bi-play-circle"></i>
                            </h1>
                            <h1>
                                {language === "HE" ? "תמונה" : "Image"}
                                <i className="bi bi-file-image"></i>
                            </h1>
                            <h1>
                                {language === "HE" ? "טקסט" : "Text"}
                                <i className="bi bi-chat-dots"></i>
                            </h1>
                        </div>
                    </div>
                )}
                {posts && users && user && (
                    <div className="posts">
                        <ul>
                            {posts.map((p) => (
                                <li key={p._id}>
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
                                                <h1>
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
                                        <div>
                                            {p.image?.src && (
                                                <img
                                                    src={p.image?.src}
                                                    alt="Image"
                                                />
                                            )}
                                            {p.video?.src && !p.image?.src && (
                                                <video
                                                    src={p.video?.src}
                                                ></video>
                                            )}
                                        </div>
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
                                                    {language === "HE"
                                                        ? "הודעות"
                                                        : "Comments"}
                                                </h2>
                                            </span>
                                        </div>
                                        <hr />
                                        <Messages
                                            setMessagesParent={setMessages}
                                            handleToggleLikePost={
                                                handleToggleLikePost
                                            }
                                            checkIfLiked={checkIfLiked}
                                            post={p}
                                        />
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
            {createPostPopup && (
                <CreatePost
                    setDisplayRefreshBtn={setDisplayRefreshBtn}
                    user={user}
                    setCreatePostPopup={setCreatePostPopup}
                />
            )}

            <div className="footerInHome">
                <Footer
                    displayLogo={false}
                    displayNav={false}
                    marginTop={false}
                />
            </div>
        </div>
    );
};

export default Home;
