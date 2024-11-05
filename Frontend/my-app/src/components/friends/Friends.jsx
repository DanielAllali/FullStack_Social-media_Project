import React, { useEffect, useState } from "react";
import "./friends.css";
import Header from "../header/Header";
import { useSelector } from "react-redux";
import useApi from "../../hooks/useApi";
import { useNavigate } from "react-router-dom";
import BigLoader from "../loader/BigLoader";
const Friends = () => {
    const user = useSelector((state) => state.tiktak.user);
    const language = useSelector((state) => state.tiktak.language);
    const [errors, setErrors, isLoading, apiResponse, callApi] = useApi();
    const [page, setPage] = useState(1);
    const navigate = useNavigate();

    const [users, setUsers] = useState([]);

    useEffect(() => {
        callApi("http://localhost:9999/users");
    }, []);
    useEffect(() => {
        if (apiResponse && !errors) {
            setUsers(apiResponse);
        }
    }, [apiResponse, errors]);
    return (
        <div id="friends">
            <Header />
            <div className="friends">
                <ul>
                    <li>{language === "HE" ? "חברים" : "Friends"}</li>
                    {users
                        .filter(
                            (u) =>
                                u.followers.includes(user._id) &&
                                user.followers.includes(u._id) &&
                                !u.deleted
                        )
                        .slice((page - 1) * 5, page * 5)
                        .map((u) => (
                            <li
                                onClick={() => {
                                    navigate(`/user-profile/${u._id}/posts`);
                                }}
                            >
                                <div>
                                    <img src={u.image.src} alt={u.image.alt} />
                                    <div>
                                        <h1>{u.username}</h1>
                                        <h2>{`${u.name.firstName} ${u.name.lastName}`}</h2>
                                    </div>
                                </div>
                            </li>
                        ))}
                    {users.filter(
                        (u) =>
                            u.followers.includes(user._id) &&
                            user.followers.includes(u._id) &&
                            !u.deleted
                    ).length < 1 && (
                        <h1>
                            {language === "HE"
                                ? "אין לך חברים..."
                                : "No friends..."}
                        </h1>
                    )}
                    {users.filter(
                        (u) =>
                            u.followers.includes(user._id) &&
                            user.followers.includes(u._id) &&
                            !u.deleted
                    ).length > 5 && (
                        <li className="pagesLi">
                            <h2>{language === "HE" ? "עמוד" : "Page"}</h2>
                            {Array.from(
                                {
                                    length: Math.ceil(
                                        users.filter(
                                            (u) =>
                                                u.followers.includes(
                                                    user._id
                                                ) &&
                                                user.followers.includes(
                                                    u._id
                                                ) &&
                                                !u.deleted
                                        ) / 5
                                    ),
                                },
                                (_, index) => (
                                    <button
                                        onClick={() => {
                                            setPage(index + 1);
                                        }}
                                        key={index}
                                        className={
                                            page === index + 1 ? "active" : ""
                                        }
                                    >
                                        {index + 1}
                                    </button>
                                )
                            )}
                        </li>
                    )}
                    {users.filter(
                        (u) =>
                            u.followers.includes(user._id) &&
                            user.followers.includes(u._id) &&
                            !u.deleted
                    ).length < 5 && <li></li>}
                </ul>
            </div>
            {isLoading && <BigLoader />}
        </div>
    );
};

export default Friends;
