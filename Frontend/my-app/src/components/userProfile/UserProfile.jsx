import React, { useEffect, useState } from "react";
import "./userProfile.css";
import Header from "../header/Header";
import { Link, useNavigate, useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useSelector } from "react-redux";
import useApi, { METHOD } from "../../hooks/useApi";
import toast from "react-hot-toast";
import Footer from "../footer/Footer";
import Post from "../post/Post";
import EditUser from "./EditUser";

const UserProfile = () => {
    const language = useSelector((state) => state.tiktak.language);
    const user = useSelector((state) => state.tiktak.user);
    const { tab } = useParams();
    const { userId } = useParams();
    const navigate = useNavigate();

    const [users, setUsers] = useState(null);
    const [posts, setPosts] = useState(null);

    const [errors, setErrors, isLoading, apiResponse, callApi] = useApi();
    const [method, setMethod] = useState(null);
    const [userProfile, setUserProfile] = useState(null);
    const [isEditUser, setIsEditUser] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            await callApi(`http://localhost:9999/users/${userId}`, METHOD.GET);
            setMethod("GET USER");

            await callApi("http://localhost:9999/users", METHOD.GET);
            setMethod("GET ALL USERS");

            await callApi("http://localhost:9999/posts", METHOD.GET);
            setMethod("GET ALL POSTS");
        };
        fetchData();
    }, []);
    useEffect(() => {
        if (apiResponse && !errors && method === "GET USER") {
            setUserProfile(apiResponse);
            setMethod(null);
        }
        if (apiResponse && !errors && method === "TOGGLE FOLLOW USER") {
            let newUser = userProfile;
            newUser.followers = apiResponse.followers;
            setUserProfile(newUser);
            setMethod(null);
        }
        if (apiResponse && !errors && method === "GET ALL USERS") {
            setUsers(apiResponse);
            setMethod(null);
        }
        if (apiResponse && !errors && method === "GET ALL POSTS") {
            setPosts(apiResponse);
            setMethod(null);
        }
        if (!apiResponse && errors && method !== null) {
            toast.error(errors);
        }
    }, [apiResponse, errors, method]);
    const checkIfFollow = () => {
        if (user && userProfile) {
            for (let i = 0; i < userProfile.followers.length; i++) {
                if (
                    userProfile.followers[i].toString() === user._id.toString()
                ) {
                    return true;
                }
            }
            return false;
        } else {
            return false;
        }
    };
    const handleToggleFollowUser = async () => {
        if (user && String(userProfile._id) !== String(user._id)) {
            await callApi(
                `http://localhost:9999/users/follow/${userProfile._id.toString()}`,
                METHOD.PATCH,
                null,
                { Authorization: localStorage.getItem("jwt-token") }
            );
            setMethod("TOGGLE FOLLOW USER");
        }
    };

    return (
        <div id="userProfile">
            <Header />
            {userProfile && (
                <>
                    <div className="header">
                        <div>
                            <div className="userInfo">
                                <div>
                                    <div>
                                        <img
                                            src={userProfile.image.src}
                                            alt="user profile picture"
                                        />
                                    </div>
                                    <div>
                                        <h1>{`${userProfile.name.firstName} ${userProfile.name.lastName}`}</h1>
                                        <h2>{userProfile.username}</h2>
                                    </div>
                                </div>
                                <div>
                                    {userProfile.bio && userProfile.bio !== ""
                                        ? userProfile.bio
                                        : language === "HE"
                                        ? "אין ביו."
                                        : "No bio."}
                                </div>
                            </div>
                            {String(userProfile._id) ===
                            String(user ? user._id : null) ? (
                                <button
                                    onClick={() => {
                                        setIsEditUser(true);
                                    }}
                                >
                                    {language === "HE"
                                        ? "עריכת פרופיל"
                                        : "Edit profile"}
                                    <i className="bi bi-pencil"></i>
                                </button>
                            ) : checkIfFollow() ? (
                                <button
                                    className="followed"
                                    onClick={handleToggleFollowUser}
                                >
                                    {language === "HE"
                                        ? "הסר עוקב"
                                        : "Unfollow"}
                                    <i className="bi bi-person-dash"></i>
                                </button>
                            ) : user ? (
                                <button onClick={handleToggleFollowUser}>
                                    {language === "HE" ? "עקוב" : "Follow"}
                                    <i className="bi bi-person-add"></i>
                                </button>
                            ) : (
                                <h4
                                    className="loginToFollow"
                                    onClick={() => {
                                        navigate("/login");
                                    }}
                                >
                                    {language === "HE"
                                        ? "התחבר/י בשביל לעקוב"
                                        : "Login to follow"}
                                </h4>
                            )}
                        </div>
                        <hr />
                        {users && posts && (
                            <div>
                                <h1>
                                    <span>
                                        {
                                            posts.filter(
                                                (p) =>
                                                    p.user_id.toString() ===
                                                        userProfile._id.toString() &&
                                                    !p.deleted
                                            ).length
                                        }
                                    </span>
                                    {language === "HE" ? "פוסטים" : "Posts"}
                                </h1>
                                <h1>
                                    <span>{userProfile.followers.length}</span>
                                    {language === "HE" ? "עוקבים" : "Followers"}
                                </h1>
                                <h1>
                                    <span>
                                        {
                                            users.filter(
                                                (u) =>
                                                    u.followers.toString() ===
                                                    userProfile._id.toString()
                                            ).length
                                        }
                                    </span>
                                    {language === "HE"
                                        ? "עוקב אחרי"
                                        : "Following"}
                                </h1>
                            </div>
                        )}
                        <nav>
                            <ul>
                                <li className={tab === "posts" ? "active" : ""}>
                                    <Link
                                        to={`/user-profile/${userProfile._id}/posts`}
                                    >
                                        {language === "HE" ? "פוסטים" : "Posts"}
                                    </Link>
                                </li>

                                {String(userProfile._id) ===
                                    String(user ? user._id : null) && (
                                    <>
                                        <li
                                            className={
                                                tab === "saved-posts"
                                                    ? "active"
                                                    : ""
                                            }
                                        >
                                            <Link
                                                to={`/user-profile/${userProfile._id}/saved-posts`}
                                            >
                                                {language === "HE"
                                                    ? "פוסטים שמורים"
                                                    : "Saved posts"}
                                            </Link>
                                        </li>
                                        <li
                                            className={
                                                tab === "liked-posts"
                                                    ? "active"
                                                    : ""
                                            }
                                        >
                                            <Link
                                                to={`/user-profile/${userProfile._id}/liked-posts`}
                                            >
                                                {language === "HE"
                                                    ? "פוסטים אהובים"
                                                    : "Liked posts"}
                                            </Link>
                                        </li>
                                    </>
                                )}
                                <li
                                    className={
                                        tab === "followers" ? "active" : ""
                                    }
                                >
                                    <Link
                                        to={`/user-profile/${userProfile._id}/followers`}
                                    >
                                        {language === "HE"
                                            ? "עוקבים"
                                            : "Followers"}
                                    </Link>
                                </li>
                                <li
                                    className={
                                        tab === "following" ? "active" : ""
                                    }
                                >
                                    <Link
                                        to={`/user-profile/${userProfile._id}/following`}
                                    >
                                        {language === "HE"
                                            ? "עוקב אחרי"
                                            : "Following"}
                                    </Link>
                                </li>
                            </ul>
                        </nav>
                    </div>

                    {tab === "posts" && posts && (
                        <div className="posts">
                            <ul>
                                {posts
                                    .filter(
                                        (p) =>
                                            p.user_id.toString() ===
                                            userProfile._id.toString()
                                    )
                                    .map((p) => (
                                        <li key={p._id}>
                                            <Post post={p} />
                                        </li>
                                    ))}
                                {posts.filter(
                                    (p) =>
                                        p.user_id.toString() ===
                                        userProfile._id.toString()
                                ).length < 1 && (
                                    <h2>
                                        {language === "HE"
                                            ? "למשתמש זה אין פוסטים..."
                                            : "This user has no posts..."}
                                    </h2>
                                )}
                            </ul>
                        </div>
                    )}

                    {tab === "followers" && userProfile && users && (
                        <div className="followers">
                            <ul>
                                {users
                                    .filter((user) =>
                                        userProfile.followers.includes(
                                            user._id.toString()
                                        )
                                    )
                                    .map((u) => (
                                        <li key={u._id}>
                                            <div className="profilePicture">
                                                {u.image?.src && (
                                                    <img
                                                        src={u.image.src}
                                                        alt="profile picture"
                                                    />
                                                )}
                                            </div>
                                            <div>
                                                <h1
                                                    onClick={() => {
                                                        navigate(
                                                            `/user-profile/${u._id}/posts`
                                                        );
                                                        window.location.reload();
                                                    }}
                                                >
                                                    {u.username}
                                                </h1>
                                                <h2>{`${u.name.firstName} ${u.name.lastName}`}</h2>
                                            </div>
                                        </li>
                                    ))}
                            </ul>
                            {userProfile.followers.length < 1 && (
                                <h2>
                                    {language === "HE"
                                        ? "למשתמש זה אין עוקבים."
                                        : "This user has no followers."}
                                </h2>
                            )}
                        </div>
                    )}
                    {tab === "following" && userProfile && users && (
                        <div className="followers">
                            <ul>
                                {users
                                    .filter((user) =>
                                        user.followers.includes(
                                            userProfile._id.toString()
                                        )
                                    )
                                    .map((u) => (
                                        <li key={u._id}>
                                            <div className="profilePicture">
                                                {u.image?.src && (
                                                    <img
                                                        src={u.image.src}
                                                        alt="profile picture"
                                                    />
                                                )}
                                            </div>
                                            <div>
                                                <h1
                                                    onClick={() => {
                                                        navigate(
                                                            `/user-profile/${u._id}/posts`
                                                        );
                                                        window.location.reload();
                                                    }}
                                                >
                                                    {u.username}
                                                </h1>
                                                <h2>{`${u.name.firstName} ${u.name.lastName}`}</h2>
                                            </div>
                                        </li>
                                    ))}
                            </ul>
                            {users.filter((user) =>
                                user.followers.includes(
                                    userProfile._id.toString()
                                )
                            ).length < 1 && (
                                <h2>
                                    {language === "HE"
                                        ? "משתמש זה לא עוקב אחרי אף אחד."
                                        : "This user doesn't follow anybody."}
                                </h2>
                            )}
                        </div>
                    )}
                    {tab === "saved-posts" && userProfile && posts && (
                        <div className="followers">
                            <ul>
                                {posts
                                    .filter((p) =>
                                        userProfile.saved_posts.includes(
                                            p._id.toString()
                                        )
                                    )
                                    .map((p) => (
                                        <Post post={p} />
                                    ))}
                            </ul>
                            {posts.filter((p) =>
                                userProfile.saved_posts.includes(
                                    p._id.toString()
                                )
                            ).length < 1 && (
                                <h2>
                                    {language === "HE"
                                        ? "לא שמרת פוסטים."
                                        : "You didn't saved any posts."}
                                </h2>
                            )}
                        </div>
                    )}
                    {tab === "liked-posts" && userProfile && posts && (
                        <div className="followers">
                            <ul>
                                {posts
                                    .filter((p) =>
                                        p.likes.includes(userProfile._id)
                                    )
                                    .map((p) => (
                                        <Post post={p} />
                                    ))}
                            </ul>
                            {posts.filter((p) =>
                                p.likes.includes(userProfile._id)
                            ).length < 1 && (
                                <h2>
                                    {language === "HE"
                                        ? "לא שמרת פוסטים."
                                        : "You didn't saved any posts."}
                                </h2>
                            )}
                        </div>
                    )}
                </>
            )}
            {isEditUser && (
                <EditUser setIsEditUser={setIsEditUser} user={user} />
            )}
            <div className="footerInHome">
                <Footer
                    displayLogo={false}
                    displayNav={false}
                    marginTop={false}
                    width="400px"
                />
            </div>
        </div>
    );
};

export default UserProfile;
