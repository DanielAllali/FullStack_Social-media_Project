import React, { useEffect, useState } from "react";
import "./search.css";
import Header from "../header/Header";
import Footer from "../footer/Footer";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import useApi from "../../hooks/useApi";
import Post from "../post/Post";
import Loader from "../loader/Loader";

const Search = () => {
    const navigate = useNavigate();
    const language = useSelector((state) => state.tiktak.language);
    const user = useSelector((state) => state.tiktak.user);
    const { tab } = useParams();

    const [errors, setErrors, isLoading, apiResponse, callApi] = useApi();
    const [posts, setPosts] = useState(null);
    const [users, setUsers] = useState(null);
    const [friends, setFriends] = useState(null);
    const [searchedArr, setSearchedArr] = useState(null);
    const [isSearching, setIsSearching] = useState(false);
    const [method, setMethod] = useState(null);
    const [page, setPage] = useState(1);
    const [byParam, setByParam] = useState({
        byTimeIsUp: false,
        byLikesIsUp: true,
    });

    useEffect(() => {
        const fetchData = async () => {
            await callApi("http://localhost:9999/users");
            setMethod("GET ALL USERS");
        };
        fetchData();
    }, []);
    useEffect(() => {
        if (users && user) {
            setFriends(
                users.filter(
                    (u) =>
                        u.followers.includes(user._id) &&
                        user.followers.includes(u._id)
                )
            );
        }
        const fetchData = async () => {
            await callApi("http://localhost:9999/posts");
            setMethod("GET ALL POSTS");
        };
        fetchData();
    }, [users]);
    useEffect(() => {
        if (apiResponse && !errors && method === "GET ALL USERS") {
            setUsers(apiResponse);
            setMethod(null);
            return;
        }
        if (apiResponse && !errors && method === "GET ALL POSTS") {
            setPosts(apiResponse);
            setMethod(null);
            return;
        }
    }, [apiResponse, errors, method]);
    const handleSortByTime = (isLatest, array, setArray) => {
        const updatedSort = byParam;
        updatedSort.byTimeIsUp = isLatest;
        setByParam(updatedSort);
        const sortedFilter = [...array].sort((a, b) => {
            const dateA = new Date(a.createdAt);
            const dateB = new Date(b.createdAt);

            return isLatest ? dateB - dateA : dateA - dateB;
        });

        setArray(sortedFilter);
    };
    const handleSortByLikes = (isMost, array, setArray) => {
        if (Array.isArray(array)) {
            const sortedArray = array.slice().sort((a, b) => {
                const likesA = a.likes ? a.likes.length : 0;
                const likesB = b.likes ? b.likes.length : 0;

                return isMost ? likesB - likesA : likesA - likesB;
            });

            setArray(sortedArray);
        }
    };
    const handleSearchChange = (e, array) => {
        if (Array.isArray(array) && e.target.value !== "") {
            const searchedValue = e.target.value.toLowerCase();
            if (tab === "posts") {
                const updatedArr_title = array.filter((i) =>
                    i.title.toLowerCase().includes(searchedValue)
                );
                const updatedArr_subtitle = array.filter((i) =>
                    i.subtitle.toLowerCase().includes(searchedValue)
                );
                const updatedArr_content = array.filter((i) =>
                    i.content.toLowerCase().includes(searchedValue)
                );
                const combinedArr = [
                    ...updatedArr_title,
                    ...updatedArr_subtitle,
                    ...updatedArr_content,
                ];
                const updatedArr = Array.from(
                    new Map(
                        combinedArr.map((item) => [item._id, item])
                    ).values()
                );
                setSearchedArr(updatedArr);
                setIsSearching(true);
                return;
            }
            if (tab === "users" || tab === "friends-search") {
                const updatedArr_title = array.filter((i) =>
                    i.username.toLowerCase().includes(searchedValue)
                );
                const updatedArr_subtitle = array.filter((i) =>
                    i.name.firstName.toLowerCase().includes(searchedValue)
                );
                const updatedArr_content = array.filter((i) =>
                    i.name.lastName.toLowerCase().includes(searchedValue)
                );
                const combinedArr = [
                    ...updatedArr_title,
                    ...updatedArr_subtitle,
                    ...updatedArr_content,
                ];
                const updatedArr = Array.from(
                    new Map(
                        combinedArr.map((item) => [item._id, item])
                    ).values()
                );
                setSearchedArr(updatedArr);
                setIsSearching(true);
                return;
            }
        }
        if (e.target.value === "") {
            setIsSearching(false);
        }
    };

    return (
        <div id="search">
            <Header />
            <div className="searchContent">
                <div className="searchSettings">
                    <div>
                        <button
                            className={tab === "posts" ? "active" : ""}
                            onClick={() => {
                                navigate("/search/posts");
                                window.location.reload();
                            }}
                        >
                            {language === "HE" ? "פוסטים" : "Posts"}
                        </button>
                        <button
                            className={tab === "users" ? "active" : ""}
                            onClick={() => {
                                navigate("/search/users");
                                window.location.reload();
                            }}
                        >
                            {language === "HE" ? "משתמשים" : "Users"}
                        </button>
                        {user && (
                            <button
                                className={
                                    tab === "friends-search" ? "active" : ""
                                }
                                onClick={() => {
                                    navigate("/search/friends-search");
                                    window.location.reload();
                                }}
                            >
                                {language === "HE" ? "חברים" : "Friends"}
                            </button>
                        )}
                    </div>
                    <div>
                        <h2>{language === "HE" ? "לפי זמן" : "By time"}</h2>
                        <button
                            className={byParam.byTimeIsUp ? "active" : ""}
                            onClick={() => {
                                handleSortByTime(
                                    true,
                                    isSearching
                                        ? searchedArr
                                        : tab === "posts"
                                        ? posts
                                        : tab === "users"
                                        ? users
                                        : friends,
                                    isSearching
                                        ? setSearchedArr
                                        : tab === "posts"
                                        ? setPosts
                                        : tab === "users"
                                        ? setUsers
                                        : setFriends
                                );
                            }}
                        >
                            <i className="bi bi-caret-up-fill"></i>
                        </button>
                        <button
                            className={byParam.byTimeIsUp ? "" : "active"}
                            onClick={() => {
                                handleSortByTime(
                                    false,
                                    isSearching
                                        ? searchedArr
                                        : tab === "posts"
                                        ? posts
                                        : tab === "users"
                                        ? users
                                        : friends,
                                    isSearching
                                        ? setSearchedArr
                                        : tab === "posts"
                                        ? setPosts
                                        : tab === "users"
                                        ? setUsers
                                        : setFriends
                                );
                            }}
                        >
                            <i className="bi bi-caret-down-fill"></i>
                        </button>
                        {tab === "posts" && (
                            <>
                                <h2>
                                    {language === "HE"
                                        ? "לפי לייקים"
                                        : "By likes"}
                                </h2>
                                <button
                                    className={
                                        byParam.byLikesIsUp ? "active" : ""
                                    }
                                    onClick={() => {
                                        let updatedLikes = byParam;
                                        updatedLikes.byLikesIsUp = true;
                                        setByParam(updatedLikes);
                                        handleSortByLikes(
                                            true,
                                            posts,
                                            setPosts
                                        );
                                    }}
                                >
                                    <i className="bi bi-caret-up-fill"></i>
                                </button>
                                <button
                                    className={
                                        byParam.byLikesIsUp ? "" : "active"
                                    }
                                    onClick={() => {
                                        let updatedLikes = byParam;
                                        updatedLikes.byLikesIsUp = false;
                                        setByParam(updatedLikes);
                                        handleSortByLikes(
                                            false,
                                            posts,
                                            setPosts
                                        );
                                    }}
                                >
                                    <i className="bi bi-caret-down-fill"></i>
                                </button>
                            </>
                        )}
                    </div>
                    <div>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                            }}
                        >
                            <input
                                type="text"
                                onChange={(e) => {
                                    handleSearchChange(
                                        e,
                                        tab === "posts"
                                            ? posts
                                            : tab === "users"
                                            ? users
                                            : friends
                                    );
                                }}
                                placeholder={
                                    language === "HE"
                                        ? "חפש פריט..."
                                        : "Search item..."
                                }
                            />
                            <button type="submit">
                                <i className="bi bi-search"></i>
                            </button>
                        </form>
                    </div>
                </div>
                <div className="items">
                    <ul>
                        {tab === "posts" && posts && (
                            <>
                                {!isSearching &&
                                    posts
                                        .filter((p) => !p.deleted)
                                        .slice((page - 1) * 5, page * 5)
                                        .map((p) => (
                                            <li key={p._id}>
                                                <Post post={p} />
                                            </li>
                                        ))}
                                {isSearching &&
                                    searchedArr
                                        .filter((p) => !p.deleted)
                                        .slice((page - 1) * 5, page * 5)
                                        .map((p) => (
                                            <li key={p._id}>
                                                <Post post={p} />
                                            </li>
                                        ))}
                            </>
                        )}
                        {tab === "users" && users && (
                            <>
                                {!isSearching &&
                                    users
                                        .filter((u) => !u.deleted)
                                        .slice((page - 1) * 5, page * 5)
                                        .map((u) => (
                                            <li
                                                onClick={() => {
                                                    navigate(
                                                        `/user-profile/${u._id}/posts`
                                                    );
                                                }}
                                                className="user"
                                                key={u._id}
                                            >
                                                <img
                                                    src={u.image.src}
                                                    alt={u.image.alt}
                                                />
                                                <div>
                                                    <h1>{u.username}</h1>
                                                    <h2>{`${u.name.firstName} ${u.name.lastName}`}</h2>
                                                </div>
                                            </li>
                                        ))}
                                {isSearching &&
                                    searchedArr
                                        .filter((u) => !u.deleted)
                                        .slice((page - 1) * 5, page * 5)
                                        .map((u) => (
                                            <li
                                                onClick={() => {
                                                    navigate(
                                                        `/user-profile/${u._id}/posts`
                                                    );
                                                }}
                                                className="user"
                                                key={u._id}
                                            >
                                                <img
                                                    src={u.image.src}
                                                    alt={u.image.alt}
                                                />
                                                <div>
                                                    <h1>{u.username}</h1>
                                                    <h2>{`${u.name.firstName} ${u.name.lastName}`}</h2>
                                                </div>
                                            </li>
                                        ))}
                            </>
                        )}
                        {tab === "friends-search" && friends && (
                            <>
                                {!isSearching &&
                                    friends
                                        .filter((u) => !u.deleted)
                                        .slice((page - 1) * 5, page * 5)
                                        .map((u) => (
                                            <li
                                                onClick={() => {
                                                    navigate(
                                                        `/user-profile/${u._id}/posts`
                                                    );
                                                }}
                                                className="user"
                                                key={u._id}
                                            >
                                                <img
                                                    src={u.image.src}
                                                    alt={u.image.alt}
                                                />
                                                <div>
                                                    <h1>{u.username}</h1>
                                                    <h2>{`${u.name.firstName} ${u.name.lastName}`}</h2>
                                                </div>
                                            </li>
                                        ))}
                                {isSearching &&
                                    searchedArr
                                        .filter((u) => !u.deleted)
                                        .slice((page - 1) * 5, page * 5)
                                        .map((u) => (
                                            <li
                                                onClick={() => {
                                                    navigate(
                                                        `/user-profile/${u._id}/posts`
                                                    );
                                                }}
                                                className="user"
                                                key={u._id}
                                            >
                                                <img
                                                    src={u.image.src}
                                                    alt={u.image.alt}
                                                />
                                                <div>
                                                    <h1>{u.username}</h1>
                                                    <h2>{`${u.name.firstName} ${u.name.lastName}`}</h2>
                                                </div>
                                            </li>
                                        ))}
                            </>
                        )}
                        {!isSearching && posts && users && friends && (
                            <li className="pagesLi">
                                <h2>{language === "HE" ? "עמוד" : "Page"}</h2>
                                {Array.from(
                                    {
                                        length: Math.ceil(
                                            (tab === "posts"
                                                ? posts.length
                                                : tab === "users"
                                                ? users.length
                                                : friends.length) / 5
                                        ),
                                    },
                                    (_, index) => (
                                        <button
                                            onClick={() => {
                                                setPage(index + 1);
                                            }}
                                            key={index}
                                            className={
                                                page === index + 1
                                                    ? "active"
                                                    : ""
                                            }
                                        >
                                            {index + 1}
                                        </button>
                                    )
                                )}
                            </li>
                        )}
                    </ul>
                </div>
            </div>
            {isLoading && (
                <div className="searchLoader">
                    <Loader size={200} />
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

export default Search;
