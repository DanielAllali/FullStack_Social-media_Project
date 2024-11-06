import React from "react";
import { useSelector } from "react-redux";
import "./helpAbout.css";
import Header from "../header/Header";
import Footer from "../footer/Footer";

const About = () => {
    const language = useSelector((state) => state.tiktak.language);

    return (
        <div id="about">
            <Header />
            <div className="about-container">
                <h1>{language === "HE" ? "עלינו" : "About Us"}</h1>
                <p>
                    {language === "HE"
                        ? "ברוכים הבאים לאפליקציה החברתית שלנו! כאן תוכלו ליצור קשרים, לשתף חוויות ולהתעדכן בחדשות. היכנסו לעולם מלא בפעילות חברתית."
                        : "Welcome to our social media app! Here, you can connect with others, share experiences, and stay updated. Join a world full of social interaction."}
                </p>
                <h2>{language === "HE" ? "מאפיינים" : "Features"}</h2>
                <ul className="features-list">
                    <li>
                        {language === "HE"
                            ? "הרשמה וכניסה לחשבון"
                            : "Sign up and log in"}
                    </li>
                    <li>
                        {language === "HE"
                            ? "אפשרויות למשתמש מחובר: הגדרות, חברים, מעקב, לייקים ותגובות"
                            : "For logged-in users: settings, friends, following, likes, and comments"}
                    </li>
                    <li>
                        {language === "HE"
                            ? "הגדרות עיצוב ומצב לילה"
                            : "Custom themes and night mode settings"}
                    </li>
                    <li>
                        {language === "HE"
                            ? "שינוי סיסמה בהגדרות"
                            : "Change password in settings"}
                    </li>
                </ul>
            </div>
            <Footer />
        </div>
    );
};

export default About;
