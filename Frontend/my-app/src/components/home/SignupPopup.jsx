import React from "react";
import "./home.css";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const SignupPopup = ({ setIsDisplay }) => {
    const language = useSelector((state) => state.tiktak.language);
    return (
        <div className="signupPopupWrapper">
            <div>
                <h1>{language === "HE" ? "הרשמה" : "Sign up"}</h1>
                <p>
                    {language === "HE"
                        ? "אם לא תרשם לא תוכל לעשות לייק/להגיב/ליצור ועוד..."
                        : "If you won't signup you won't be able to like/comment/post etc.."}
                </p>
                <div>
                    <Link to="/signup">
                        <button
                            onClick={() => {
                                setIsDisplay(false);
                            }}
                        >
                            {language === "HE" ? "הרשם" : "Signup"}
                        </button>
                    </Link>
                    <button
                        onClick={() => {
                            setIsDisplay(false);
                        }}
                    >
                        {language === "HE" ? "המשיך כאורח" : "Keep as quest"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SignupPopup;
