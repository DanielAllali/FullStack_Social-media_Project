import React, { useEffect, useState } from "react";
import "./userProfile.css";
import Header from "../header/Header";
import { Link, useNavigate, useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useSelector } from "react-redux";
import useApi, { METHOD } from "../../hooks/useApi";
import toast from "react-hot-toast";
import Footer from "../footer/Footer";

const UserProfile = () => {
    const language = useSelector((state) => state.tiktak.language);
    const user = useSelector((state) => state.tiktak.user);
    const { tab } = useParams();
    const { userId } = useParams();

    const [errors, setErrors, isLoading, apiResponse, callApi] = useApi();
    const [method, setMethod] = useState(null);
    const [userProfile, setUserProfile] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            await callApi(`http://localhost:9999/users/${userId}`, METHOD.GET);
            setMethod("GET USER");
        };
        fetchUser();
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
        if (String(userProfile._id) !== String(user._id)) {
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
            {userProfile && user && (
                <>
                    <header>
                        <div>
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
                            {String(userProfile._id) === String(user._id) ? (
                                <button>
                                    {language === "HE"
                                        ? "עריכת פרופיל"
                                        : "Edit profile"}
                                    <i className="bi bi-pencil"></i>
                                </button>
                            ) : checkIfFollow() ? (
                                <button onClick={handleToggleFollowUser}>
                                    {language === "HE"
                                        ? "הסר עוקב"
                                        : "Unfollow"}
                                    <i className="bi bi-person-dash"></i>
                                </button>
                            ) : (
                                <button onClick={handleToggleFollowUser}>
                                    {language === "HE" ? "עקוב" : "Follow"}
                                    <i className="bi bi-person-add"></i>
                                </button>
                            )}
                        </div>
                        <hr />
                        <nav>
                            <ul>
                                <li className={tab === "posts" ? "active" : ""}>
                                    <Link
                                        to={`/user-profile/${userProfile._id}/posts`}
                                    >
                                        {language === "HE" ? "פוסטים" : "Posts"}
                                    </Link>
                                </li>
                                <li
                                    className={
                                        tab === "saved-posts" ? "active" : ""
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
                                        tab === "liked-posts" ? "active" : ""
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
                            </ul>
                        </nav>
                    </header>
                </>
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

export default UserProfile;
