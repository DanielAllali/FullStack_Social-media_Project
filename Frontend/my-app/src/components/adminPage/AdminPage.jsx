import React, { useEffect, useState } from "react";
import "./adminPage.css";
import Header from "../header/Header";
import { useSelector } from "react-redux";
import useApi, { METHOD } from "../../hooks/useApi";
import toast from "react-hot-toast";
import EditUser from "../userProfile/EditUser";
import { useNavigate } from "react-router-dom";
const AdminPage = () => {
    const language = useSelector((state) => state.tiktak.language);
    const user = useSelector((state) => state.tiktak.user);
    const navigate = useNavigate();
    const [errors, setErrors, isLoading, apiResponse, callApi] = useApi();

    const [users, setUsers] = useState([]);
    const [isEditUser, setIsEditUser] = useState(false);
    const [isDeleteUser, setIsDeleteUser] = useState(false);
    const [pickedUser, setPickedUser] = useState(null);
    const [isSearching, setIsSearching] = useState(false);
    const [searchedUsers, setSearchedUsers] = useState([]);
    const [page, setPage] = useState(1);
    const [method, setMethod] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            await callApi("http://localhost:9999/users");
            setMethod("GET ALL USERS");
        };
        fetchData();
    }, []);
    useEffect(() => {
        if (apiResponse && !errors && method === "GET ALL USERS") {
            setUsers(apiResponse);
            setMethod(null);
        }
        if (apiResponse && !errors && method === "DELETE USER") {
            setUsers(
                users.map((u) => (u._id === apiResponse._id ? apiResponse : u))
            );
            toast.success(
                language === "HE"
                    ? "המשתמש נמחק בהצלחה!"
                    : "User deleted successfuly!"
            );
            setMethod(null);
        }
        if (apiResponse && !errors && method === "RESTORE USER") {
            setUsers(
                users.map((u) => (u._id === apiResponse._id ? apiResponse : u))
            );
            toast.success(
                language === "HE"
                    ? "המשתמש שוחזר בהצלחה!"
                    : "User restored successfuly!"
            );
            setMethod(null);
        }
        if (errors) {
            toast.error(language === "HE" ? "תקלה בשרת." : "Server error.");
        }
    }, [apiResponse, errors]);
    const handleSearchChange = (e) => {
        if (e.target.value !== "") {
            const searchedValue = e.target.value.toLowerCase();
            const updatedArr_username = users.filter((i) =>
                i.username.toLowerCase().includes(searchedValue)
            );
            const updatedArr_firstName = users.filter((i) =>
                i.name.firstName.toLowerCase().includes(searchedValue)
            );
            const updatedArr_lastName = users.filter((i) =>
                i.name.lastName.toLowerCase().includes(searchedValue)
            );
            const combinedArr = [
                ...updatedArr_username,
                ...updatedArr_firstName,
                ...updatedArr_lastName,
            ];
            const updatedArr = Array.from(
                new Map(combinedArr.map((item) => [item._id, item])).values()
            );

            setSearchedUsers(updatedArr);
            setIsSearching(true);
        }

        if (e.target.value === "") {
            setIsSearching(false);
        }
    };
    const handleDelete = async (user) => {
        const token = localStorage.getItem("jwt-token");
        if (token) {
            setIsDeleteUser(false);
            await callApi(
                `http://localhost:9999/users/${user._id}`,
                METHOD.DELETE,
                null,
                { authorization: token }
            );
            setMethod("DELETE USER");
        }
    };
    const handleRestore = async (user) => {
        const token = localStorage.getItem("jwt-token");
        if (token) {
            setIsDeleteUser(false);
            await callApi(
                `http://localhost:9999/users/restore-user/${user._id}`,
                METHOD.PUT,
                null,
                { authorization: token }
            );
            setMethod("RESTORE USER");
        }
    };
    return (
        <div>
            {isEditUser && (
                <EditUser setIsEditUser={setIsEditUser} user={pickedUser} />
            )}
            {isDeleteUser && (
                <div id="deleteWrapper">
                    <div>
                        <h1>
                            {language === "HE"
                                ? "אתה בטוח שאתה רוצה למחוק את המשתמש הזה?"
                                : "Are you sure you want to delete this user?"}
                        </h1>
                        <h2>{pickedUser.username}</h2>
                        <div>
                            <button
                                onClick={() => {
                                    handleDelete(pickedUser);
                                }}
                            >
                                {language === "HE"
                                    ? "מחק משתמש"
                                    : "Delete user"}
                            </button>
                            <button
                                onClick={() => {
                                    setIsDeleteUser(false);
                                }}
                            >
                                {language === "HE" ? "בטל" : "Cancel"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <Header />
            <div id="adminPage">
                <h1>{language === "HE" ? "דף אדמין" : "Admin page"}</h1>
                <input
                    onChange={handleSearchChange}
                    onFocus={() => {
                        setIsSearching(true);
                    }}
                    type="text"
                    placeholder={
                        language === "HE" ? "חפש משתמש..." : "Search user..."
                    }
                />
                <ul>
                    {(isSearching ? searchedUsers : users)
                        .slice((page - 1) * 5, page * 5)
                        .filter((u) => u._id !== user._id)
                        .map((u) => (
                            <li key={u._id}>
                                <div>
                                    <img src={u.image.src} alt={u.image.alt} />
                                    <div>
                                        <h1>{u.username}</h1>
                                        <h2>{`${u.name.firstName} ${u.name.lastName}`}</h2>
                                    </div>
                                </div>
                                <div>
                                    <button
                                        onClick={() => {
                                            setPickedUser(u);
                                            setIsEditUser(true);
                                        }}
                                    >
                                        {language === "HE" ? "ערוך" : "Edit"}
                                        <i className="bi bi-pencil-square"></i>
                                    </button>
                                    {u.deleted && (
                                        <button
                                            onClick={() => {
                                                handleRestore(u);
                                            }}
                                        >
                                            {language === "HE"
                                                ? "לשחזר"
                                                : "Restore"}
                                            <i className="bi bi-arrow-clockwise"></i>
                                        </button>
                                    )}
                                    {!u.deleted && (
                                        <button
                                            onClick={() => {
                                                setPickedUser(u);
                                                setIsDeleteUser(true);
                                            }}
                                        >
                                            {language === "HE"
                                                ? "מחק"
                                                : "Delete"}
                                            <i className="bi bi-trash3"></i>
                                        </button>
                                    )}
                                    <button
                                        onClick={() => {
                                            navigate(
                                                `/user-profile/${u._id}/posts`
                                            );
                                        }}
                                    >
                                        {language === "HE"
                                            ? "למשתמש"
                                            : "View user"}
                                        <i className="bi bi-arrow-right"></i>
                                    </button>
                                </div>
                            </li>
                        ))}

                    <li className="pagesLi">
                        <h2>{language === "HE" ? "עמוד" : "Page"}</h2>
                        {Array.from(
                            {
                                length: Math.ceil(
                                    (isSearching
                                        ? searchedUsers.length
                                        : users.length) / 5
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
                </ul>

                {!isSearching && users.length < 1 && (
                    <h1>{language === "HE" ? "אין משתמשים." : "No users."}</h1>
                )}
                {isSearching && searchedUsers.length < 1 && (
                    <h1>
                        {language === "HE"
                            ? "לא נמצאו משתמשים."
                            : "No users found."}
                    </h1>
                )}
            </div>
        </div>
    );
};

export default AdminPage;
