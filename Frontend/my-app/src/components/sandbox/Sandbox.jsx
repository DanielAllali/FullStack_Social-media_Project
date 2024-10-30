import React, { useEffect, useState } from "react";
import "./sandbox.css";
import Header from "../header/Header";
import Footer from "../footer/Footer";
import { useSelector } from "react-redux";
import useApi from "../../hooks/useApi";
import { useNavigate, useParams } from "react-router-dom";
import chick from "../../media/images/chick.png";

const Sandbox = () => {
    const language = useSelector((state) => state.tiktak.language);
    const { userId } = useParams();
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [users, setUsers] = useState(null);
    const [sandboxFilter, setSandboxFilter] = useState(null);

    const [errors, setErrors, isLoading, apiResponse, callApi] = useApi();
    const [page, setPage] = useState(1);
    useEffect(() => {
        callApi("http://localhost:9999/users");
    }, []);
    useEffect(() => {
        if (apiResponse && !errors) {
            setUsers(apiResponse);
            setUser(apiResponse.filter((u) => u._id.toString() === userId)[0]);
            setSandboxFilter(
                apiResponse
                    .filter((u) => u._id.toString() === userId)[0]
                    .sandbox.reverse()
            );
        }
    }, [apiResponse, errors]);
    const handleSortByTime = (isLatest) => {
        const sortedFilter = [...sandboxFilter].sort((a, b) => {
            const dateA = new Date(a.createdAt);
            const dateB = new Date(b.createdAt);

            return isLatest ? dateB - dateA : dateA - dateB;
        });

        setSandboxFilter(sortedFilter);
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
    return (
        <div id="sandbox">
            <Header />
            {user && sandboxFilter && (
                <div className="sandboxContent">
                    <div>
                        <h3>{language === "HE" ? "לפי זמן" : "By time"}</h3>
                        <button
                            onClick={() => {
                                handleSortByTime(true);
                            }}
                        >
                            <i class="bi bi-caret-up-fill"></i>
                        </button>
                        <button
                            onClick={() => {
                                handleSortByTime(false);
                            }}
                        >
                            <i class="bi bi-caret-down-fill"></i>
                        </button>
                    </div>
                    <ul>
                        {sandboxFilter
                            .slice((page - 1) * 5, page * 5)
                            .map((m) => (
                                <li
                                    key={m._id}
                                    onClick={() => {
                                        navigate(
                                            `/user-profile/${m.userSendId}/posts`
                                        );
                                    }}
                                >
                                    <img
                                        src={
                                            users.filter(
                                                (u) =>
                                                    u._id.toString() ===
                                                    m.userSendId.toString()
                                            )[0].image.src
                                        }
                                        alt={
                                            users.filter(
                                                (u) =>
                                                    u._id.toString() ===
                                                    m.userSendId.toString()
                                            )[0].image.alt
                                        }
                                    />
                                    <div>
                                        <h2>{`${
                                            users.filter(
                                                (u) =>
                                                    u._id.toString() ===
                                                    m.userSendId.toString()
                                            )[0].name.firstName
                                        } ${
                                            users.filter(
                                                (u) =>
                                                    u._id.toString() ===
                                                    m.userSendId.toString()
                                            )[0].name.lastName
                                        }`}</h2>
                                        <p>
                                            {language === "HE"
                                                ? m.content.he
                                                : m.content.en}
                                        </p>
                                        <h3>{getRelativeTime(m.createdAt)}</h3>
                                    </div>
                                </li>
                            ))}
                        {sandboxFilter.length < 1 && (
                            <div>
                                <h2>
                                    {language === "HE"
                                        ? "תיבת הדואר ריקה..."
                                        : "Sandbox is empty..."}
                                </h2>
                                <img src={chick} alt="chick image" />
                            </div>
                        )}
                    </ul>
                    {sandboxFilter.length > 5 && (
                        <div>
                            <h2>{language === "HE" ? "עמוד" : "Page"}</h2>
                            {Array.from(
                                { length: Math.ceil(sandboxFilter.length / 5) },
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
                        </div>
                    )}
                </div>
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

export default Sandbox;
