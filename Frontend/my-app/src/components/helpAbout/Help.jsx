import React from "react";
import "./helpAbout.css";
import Header from "../header/Header";
import { useSelector } from "react-redux";
import Footer from "../footer/Footer";

const Help = () => {
    const language = useSelector((state) => state.tiktak.language);

    const helpContent = {
        EN: [
            {
                question: "How do I sign up?",
                answer: "Click on the Sign Up button on the home page and fill in your details.",
            },
            {
                question: "How do I log in?",
                answer: "Click on the Login button and enter your email and password.",
            },
            {
                question: "How can I change my settings?",
                answer: "Go to Settings from the menu to update your personal information, password, and themes.",
            },
            {
                question: "How do I add friends?",
                answer: "Visit another user's profile and click 'Follow' and if they follow back they are friends.",
            },
            {
                question: "How can I follow someone?",
                answer: "Click the 'Follow' button on a user's profile to start following them.",
            },
            {
                question: "How do I like or comment on a post?",
                answer: "To like a post, click the heart icon. To comment, click the comment icon and type your message.",
            },
            {
                question: "What themes are available?",
                answer: "In Settings, go to 'Themes' to choose between different color themes.",
            },
            {
                question: "How do I change my password?",
                answer: "In Settings, select 'Change Password' and follow the prompts to update your password.",
            },
        ],
        HE: [
            {
                question: "איך נרשמים?",
                answer: "לחץ על כפתור ההרשמה בדף הראשי ומלא את פרטיך.",
            },
            {
                question: "איך מתחברים?",
                answer: "לחץ על כפתור ההתחברות והזן את כתובת האימייל והסיסמה שלך.",
            },
            {
                question: "איך משנים הגדרות?",
                answer: "כנס להגדרות בתפריט כדי לעדכן את המידע האישי, הסיסמה והערכות נושא שלך.",
            },
            {
                question: "איך מוסיפים חברים?",
                answer: "בקר בפרופיל של משתמש אחר ולחץ על 'עקוב' ואם הם יעקבו בחזרה הם יהיו חברים שלכם.",
            },
            {
                question: "איך עוקבים אחרי מישהו?",
                answer: "לחץ על כפתור 'עקוב' בפרופיל של משתמש כדי להתחיל לעקוב אחריו.",
            },
            {
                question: "איך אוהבים או מגיבים על פוסט?",
                answer: "לאהבת פוסט לחץ על סמל הלב. כדי להגיב לחץ על סמל התגובה והקלד את הודעתך.",
            },
            {
                question: "איזה צבעים זמינות?",
                answer: "בהגדרות, עבור אל 'צבעים' ובחר מתוך הצבעים השונים.",
            },
            {
                question: "איך משנים סיסמה?",
                answer: "בהגדרות, בחר 'שנה סיסמה' ופעל לפי ההוראות כדי לעדכן את הסיסמה.",
            },
        ],
    };

    const content = language === "HE" ? helpContent.HE : helpContent.EN;

    return (
        <div id="help">
            <Header />
            <div className="help-container">
                <h1>{language === "HE" ? "עזרה" : "Help"}</h1>
                <ul className="help-list">
                    {content.map((item, index) => (
                        <li key={index} className="help-item">
                            <strong>{item.question}</strong>
                            <p>{item.answer}</p>
                        </li>
                    ))}
                </ul>
            </div>
            <Footer />
        </div>
    );
};

export default Help;
