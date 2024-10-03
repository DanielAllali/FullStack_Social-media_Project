import React, { useEffect, useState } from "react";
import "./home.css";
import { jwtDecode } from "jwt-decode";
import { useSelector } from "react-redux";
import SignupPopup from "./SignupPopup";
import Footer from "../footer/Footer";

const Home = () => {
    const language = useSelector((state) => state.tiktak.language);
    const theme = useSelector((state) => state.tiktak.theme);
    const [signupPopup, setSignupPopup] = useState(false);
    const [user, setUser] = useState(null);
    useEffect(() => {
        const token = localStorage.getItem("jwt-token");
        if (token) {
            setUser(jwtDecode(token));
        } else {
            setSignupPopup(true);
        }
    }, []);
    return (
        <div
            id="home"
            style={{
                "--bgc": theme.weak,
                "--strong": theme.strong,
                "--highlight": theme.highlight_weak,
                "--highlight_strong": theme.highlight_strong,
            }}
        >
            {signupPopup && <SignupPopup setIsDisplay={setSignupPopup} />}
            <Footer />
        </div>
    );
};

export default Home;
