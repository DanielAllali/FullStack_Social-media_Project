import React, { useEffect, useState } from "react";
import "./home.css";
import { jwtDecode } from "jwt-decode";
import { useSelector } from "react-redux";
import SignupPopup from "./SignupPopup";
import Footer from "../footer/Footer";
import Header from "../header/Header";
import useApi, { METHOD } from "../../hooks/useApi";
import Messages from "./Messages";

const Home = () => {
    const language = useSelector((state) => state.tiktak.language);
    const theme = useSelector((state) => state.tiktak.theme);

    const [signupPopup, setSignupPopup] = useState(false);
    const [user, setUser] = useState(null);
    const [errors, setErrors, isLoading, apiResponse, callApi] = useApi();
    const [posts, setPosts] = useState(null);
    const [users, setUsers] = useState(null);
    const [method, setMethod] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("jwt-token");
        if (token) {
            setUser(jwtDecode(token));
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
        <div
            id="home"
            style={{
                "--bgc": theme.bgc,
                "--weak": theme.weak,
                "--strong-fade": `${theme.strong}4D`,
                "--strong": theme.strong,
                "--highlight": theme.highlight_weak,
                "--highlight_strong": theme.highlight_strong,
            }}
        >
            <Header />
            {signupPopup && <SignupPopup setIsDisplay={setSignupPopup} />}

            <div className="content">
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
                                                {p.messages.length}
                                                <h2>
                                                    {language === "HE"
                                                        ? "הודעות"
                                                        : "Comments"}
                                                </h2>
                                            </span>
                                        </div>
                                        <hr />
                                        <div className="likeComment">
                                            <button
                                                onClick={() => {
                                                    handleToggleLikePost(p);
                                                }}
                                            >
                                                {checkIfLiked(p)
                                                    ? language === "HE"
                                                        ? "להסיר לייק"
                                                        : "Unlike"
                                                    : language === "HE"
                                                    ? "לייק"
                                                    : "Like"}
                                                <i className="bi bi-hand-thumbs-up"></i>
                                            </button>
                                            <button>
                                                {language === "HE"
                                                    ? "הודעה"
                                                    : "Comment"}
                                                <i className="bi bi-chat"></i>
                                            </button>
                                        </div>
                                        <hr />
                                        <Messages post={p} />
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

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
