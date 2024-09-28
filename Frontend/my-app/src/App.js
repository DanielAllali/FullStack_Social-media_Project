import WelcomePage from "./components/welcomePage/WelcomePage";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import Signup from "./components/signup/Signup";

function App() {
    const theme = useSelector((state) => state.tiktak.theme);
    useEffect(() => {
        document.body.style.setProperty("--backgroundColor", theme.weak);
    }, [theme.weak]);
    return (
        <div className="App" style={{ overflowX: "hidden" }}>
            <div>
                <Toaster position="top-right" reverseOrder={false} />
            </div>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<WelcomePage />} />
                    <Route path="/signup" element={<Signup />} />
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;
