import React from "react";
import "./settings.css";
import { useSelector } from "react-redux";

const DeleteUser = () => {
    const language = useSelector((state) => state.tiktak.language);
    const user = useSelector((state) => state.tiktak.user);

    return (
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
            <form>
                <label htmlFor="password">
                    {language === "HE" ? "סיסמה" : "Password"}
                </label>
                <input
                    id="password"
                    type="text"
                    placeholder={`${user.username}123`}
                />
                <input
                    type="button"
                    value={language === "HE" ? "מחק" : "Delete"}
                />
            </form>
        </div>
    );
};

export default DeleteUser;
