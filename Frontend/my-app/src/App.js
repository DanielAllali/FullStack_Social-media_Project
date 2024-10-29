import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import Signup from "./components/signup/Signup";
import Login from "./components/login/Login";
import Home from "./components/home/Home";
import UserProfile from "./components/userProfile/UserProfile";
import RefreshBtn from "./components/refreshBtn/RefreshBtn";
import PostPreview from "./components/postPreview/PostPreview";
import Settings from "./components/settings/Settings";

function App() {
    const theme = useSelector((state) => state.tiktak.theme);
    const language = useSelector((state) => state.tiktak.language);
    const displayRefreshBtn = useSelector(
        (state) => state.tiktak.displayRefreshBtn
    );

    useEffect(() => {
        if (theme) {
            document.body.style.setProperty("--backgroundColor", theme.bgc);
        }
    }, [theme]);
    return (
        theme && (
            <div
                className="App"
                style={{
                    overflowX: "hidden",
                    "--bgc": theme.bgc,
                    "--weak": theme.weak,
                    "--weak-fade": `${theme.weak}99`,
                    "--strong-fade": `${theme.strong}4D`,
                    "--strong": theme.strong,
                    "--highlight": theme.highlight_weak,
                    "--highlight_strong": theme.highlight_strong,
                    "--direction": language === "HE" ? "rtl" : "ltr",
                }}
            >
                <div>
                    <Toaster position="top-right" reverseOrder={false} />
                </div>
                {displayRefreshBtn && <RefreshBtn />}
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<Signup />} />
                        <Route
                            path="/user-profile/:userId/:tab"
                            element={<UserProfile />}
                        />
                        <Route
                            path="/posts/:postId"
                            element={<PostPreview />}
                        />
                        <Route
                            path="/user/settings/:tab"
                            element={<Settings />}
                        />
                    </Routes>
                </BrowserRouter>
            </div>
        )
    );
}

export default App;
