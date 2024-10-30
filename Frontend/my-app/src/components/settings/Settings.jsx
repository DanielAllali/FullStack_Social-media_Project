import React from "react";
import "./settings.css";
import Header from "../header/Header";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import languageIcon from "../../media/images/languageIcon.png";
import themeIcon from "../../media/images/themeIcon.png";
import deleteIcon from "../../media/images/deleteIcon.png";
import editUserIcon from "../../media/images/editUserIcon.png";
import passwordIcon from "../../media/images/passwordIcon.png";
import Footer from "../footer/Footer";
import Theme from "./tabs/Theme";
import DeleteUser from "./tabs/DeleteUser";

const Settings = () => {
    const language = useSelector((state) => state.tiktak.language);
    const user = useSelector((state) => state.tiktak.user);
    const { tab } = useParams();
    const navigate = useNavigate();

    return (
        <div id="settings">
            <Header />
            {tab === "main" && (
                <div className="settingsMain">
                    <h1>{language === "HE" ? "הגדרות" : "Settings"}</h1>
                    <div className="tabs">
                        <div
                            onClick={() => {
                                navigate("/user/settings/language");
                            }}
                        >
                            <img src={languageIcon} alt="Language" />
                            <div>
                                <h1>
                                    {language === "HE" ? "שפה" : "Language"}
                                </h1>
                                <p>
                                    {language === "HE"
                                        ? "בחר אם אתה רוצה שפה."
                                        : "Choose if you want to change language."}
                                </p>
                            </div>
                        </div>
                        <div
                            onClick={() => {
                                navigate("/user/settings/theme");
                            }}
                        >
                            <img src={themeIcon} alt="Theme" />
                            <div>
                                <h1>{language === "HE" ? "צבע" : "Theme"}</h1>
                                <p>
                                    {language === "HE"
                                        ? "בחר אם תרצה לשנות את הצבעים של האתר."
                                        : "Choose if you want to change the colors of the website."}
                                </p>
                            </div>
                        </div>
                        <div
                            onClick={() => {
                                navigate("/user/settings/delete-user");
                            }}
                        >
                            <img src={deleteIcon} alt="Delete" />
                            <div>
                                <h1>
                                    {language === "HE"
                                        ? "מחק משתמש"
                                        : "Delete user"}
                                </h1>
                                <p>
                                    {language === "HE"
                                        ? "בחר כדי למחוק את המשתמש שלך."
                                        : "Choose to delete your user."}
                                </p>
                            </div>
                        </div>
                        <div
                            onClick={() => {
                                navigate(`/user-profile/${user._id}/posts`);
                            }}
                        >
                            <img src={editUserIcon} alt="Edit user" />
                            <div>
                                <h1>
                                    {language === "HE"
                                        ? "ערוך משתמש"
                                        : "Edit user"}
                                </h1>
                                <p>
                                    {language === "HE"
                                        ? "בחר כדי לערוך את המשתמש שלך."
                                        : "Choose to edit your user."}
                                </p>
                            </div>
                        </div>
                        <div
                            onClick={() => {
                                navigate("/user/settings/change-password");
                            }}
                        >
                            <img src={passwordIcon} alt="Change password" />
                            <div>
                                <h1>
                                    {language === "HE"
                                        ? "שנה סיסמה"
                                        : "Edit password"}
                                </h1>
                                <p>
                                    {language === "HE"
                                        ? "בחר כדי לשנות סיסמה."
                                        : "Choose to Change your user."}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {tab === "language" && (
                <div className="tab">
                    <h1>{language === "HE" ? "שפה" : "Language"}</h1>
                    <Footer
                        displayLogo={false}
                        displayNav={false}
                        displaySettings={true}
                        marginTop={false}
                        displayArrow={false}
                        displayTheme={false}
                        width="300px"
                    />
                </div>
            )}
            {tab === "theme" && <Theme />}
            {tab === "delete-user" && <DeleteUser />}
            {tab !== "main" && (
                <button
                    onClick={() => {
                        navigate("/user/settings/main");
                    }}
                    className="returnToMain"
                >
                    <i className="bi bi-arrow-right"></i>
                </button>
            )}
        </div>
    );
};

export default Settings;
