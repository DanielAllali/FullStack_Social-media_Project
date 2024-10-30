import React, { useEffect, useState } from "react";
import "./tabs.css";
import { useSelector } from "react-redux";
import useApi, { METHOD } from "../../../hooks/useApi";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const DeleteUser = () => {
    const language = useSelector((state) => state.tiktak.language);
    const user = useSelector((state) => state.tiktak.user);
    const navigate = useNavigate();

    const [password, setPassword] = useState("");
    const [passwordErr, setPasswordErr] = useState(null);
    const [errors, setErrors, isLoading, apiResponse, callApi] = useApi();
    const [method, setMethod] = useState(null);

    useEffect(() => {
        if (apiResponse && !errors && method === "DELETE USER") {
            localStorage.removeItem("jwt-token");
            navigate("/");
            setMethod(null);
            window.location.reload();
        }
        if (errors && method !== null) {
            if (errors.status === 401) {
                toast.error(
                    language === "HE"
                        ? "סיסמה לא נכונה."
                        : "Incorrect password."
                );
            }
            switch (errors.status) {
                case 401:
                    const errFor401 =
                        language === "HE"
                            ? "סיסמה לא נכונה."
                            : "Incorrect password.";
                    toast.error(errFor401);
                    setPasswordErr(errFor401);
                    return;
                case 403:
                    const errFor403 =
                        language === "HE"
                            ? "צריך לספק סיסמה."
                            : errors?.response?.data;
                    toast.error(errFor403);
                    setPasswordErr(errFor403);
                    return;
                default:
                    toast.error(errors?.response?.data);
                    return;
            }
        }
    }, [apiResponse, errors]);
    const handleSubmit = async (e) => {
        e.preventDefault();
        await callApi(
            `http://localhost:9999/users/${user._id}?password=${password}`,
            METHOD.DELETE,
            null,
            { authorization: localStorage.getItem("jwt-token") }
        );
        setMethod("DELETE USER");
    };
    return (
        user && (
            <div className="tab deleteUser-tab">
                <h1>{language === "HE" ? "מחיקת משתמש" : "Delete user"}</h1>
                <p>
                    {language === "HE"
                        ? "את/ה בטוח/ה שאת/ה רוצה למחוק את המשתמש?"
                        : "Are you sure you want to delete your user?"}
                    <br />
                    {language === "HE"
                        ? ".לא ניתן לבטל את התהליך הזה"
                        : "this proccess cannot be undone."}
                </p>
                <form onSubmit={handleSubmit}>
                    <input
                        id="password"
                        type="text"
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                        }}
                        placeholder={`${
                            language === "HE" ? "לדוגמה:" : "Example:"
                        } ${user.username}123`}
                    />
                    <h2 className={passwordErr ? "display" : ""}>
                        {passwordErr}
                    </h2>
                    <label htmlFor="password">
                        {language === "HE" ? "סיסמה" : "Password"}
                    </label>
                    <input
                        type="submit"
                        value={language === "HE" ? "מחק" : "Delete"}
                    />
                </form>
            </div>
        )
    );
};

export default DeleteUser;
