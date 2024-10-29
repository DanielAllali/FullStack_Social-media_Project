import React, { useEffect, useState } from "react";
import "./settings.css";
import { useSelector } from "react-redux";
import useApi, { METHOD } from "../../hooks/useApi";
import toast from "react-hot-toast";

const DeleteUser = () => {
    const language = useSelector((state) => state.tiktak.language);
    const user = useSelector((state) => state.tiktak.user);

    const [password, setPassword] = useState("");
    const [passwordErr, setPasswordErr] = useState(null);
    const [errors, setErrors, isLoading, apiResponse, callApi] = useApi();
    useEffect(() => {
        if (apiResponse && !errors) {
            localStorage.removeItem("jwt-token");
            window.location.reload();
        }
        if (errors) {
            if (errors.status === 401) {
                toast.error(
                    language === "HE"
                        ? "סיסמה לא נכונה."
                        : "Incorrect password."
                );
            }
            switch (errors.status) {
                case 401:
                    toast.error(
                        language === "HE"
                            ? "סיסמה לא נכונה."
                            : "Incorrect password."
                    );
                default:
                    toast.error(errors?.response?.data);
            }
        }
    }, [apiResponse, errors]);
    const handleSubmit = (e) => {
        e.preventDefault();
        callApi(
            `http://localhost:9999/users/${user._id}`,
            METHOD.DELETE,
            { password },
            { authorization: localStorage.getItem("jwt-token") }
        );
    };
    return (
        user && (
            <div className="tab deleteUser-tab">
                <h1>{language === "HE" ? "מחיקת משתמש" : "Delete user"}</h1>
                <p>
                    {language === "HE"
                        ? "את/ה בטוח שאת/ה רוצה למחוק את המשתמש?"
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
                    {passwordErr && <h2>{passwordErr}</h2>}
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
