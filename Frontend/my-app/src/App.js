import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import Signup from "./components/signup/Signup";
import Login from "./components/login/Login";
import Home from "./components/home/Home";

function App() {
    const theme = useSelector((state) => state.tiktak.theme);
    useEffect(() => {
        document.body.style.setProperty("--backgroundColor", theme.weak);
    }, [theme.weak]);
    return (
        <div
            className="App"
            style={{
                overflowX: "hidden",
                "--bgc": theme.weak,
                "--color": theme.strong,
            }}
        >
            <div>
                <Toaster position="top-right" reverseOrder={false} />
            </div>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;
