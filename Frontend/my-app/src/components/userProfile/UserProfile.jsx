import React, { useEffect, useState } from "react";
import "./userProfile.css";
import Header from "../header/Header";
import { useNavigate, useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useSelector } from "react-redux";
import useApi, { METHOD } from "../../hooks/useApi";
import toast from "react-hot-toast";

const UserProfile = () => {
    const language = useSelector((state) => state.tiktak.language);
    const { tab } = useParams();
    const { userId } = useParams();
    const navigate = useNavigate();

    const [errors, setErrors, isLoading, apiResponse, callApi] = useApi();
    const [method, setMethod] = useState(null);
    const [user, setUser] = useState(null);
    const [logedUser, setLogedUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("jwt-token");
        if (token) {
            const { exp } = jwtDecode(token);
            const currentTime = Math.floor(Date.now() / 1000);
            if (!(exp < currentTime)) {
                setLogedUser(jwtDecode(token));
            } else {
                localStorage.removeItem("jwt-token");
            }
        }
    }, []);

    useEffect(() => {
        const fetchUser = async () => {
            await callApi(`http://localhost:9999/users/${userId}`, METHOD.GET);
            setMethod("GET USER");
        };
        fetchUser();
    }, []);
    useEffect(() => {
        if (apiResponse && !errors && method === "GET USER") {
            setUser(apiResponse);
            setMethod(null);
        }
    }, [apiResponse, errors, method]);
    return (
        <div id="userProfile">
            <Header />
            {user && (
                <>
                    <header>
                        <div>
                            <div>
                                <img
                                    src={user.image.src}
                                    alt="User profile picture"
                                />
                                <div>
                                    <h1>{`${user.name.firstName} ${user.name.lastName}`}</h1>
                                    <h2>{user.username}</h2>
                                </div>
                            </div>
                            <button>
                                {language === "HE"
                                    ? "עריכת פרופיל"
                                    : "Edit profile"}
                                <i class="bi bi-pencil"></i>
                            </button>
                        </div>
                        <hr />
                        <nav>
                            <ul>
                                <li className={tab === "posts" ? "active" : ""}>
                                    {language === "HE" ? "פוסטים" : "Posts"}
                                </li>
                                <li
                                    className={
                                        tab === "saved-posts" ? "active" : ""
                                    }
                                >
                                    {language === "HE"
                                        ? "פוסטים שמורים"
                                        : "Saved posts"}
                                </li>
                                <li
                                    className={
                                        tab === "liked-posts" ? "active" : ""
                                    }
                                >
                                    {language === "HE"
                                        ? "פוסטים אהובים"
                                        : "Liked posts"}
                                </li>
                            </ul>
                        </nav>
                    </header>
                </>
            )}
        </div>
    );
};

export default UserProfile;
