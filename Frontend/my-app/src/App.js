import WelcomePage from "./components/welcomePage/WelcomePage";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

function App() {
    return (
        <div className="App" style={{ overflowX: "hidden" }}>
            <div>
                <Toaster position="top-right" reverseOrder={false} />
            </div>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<WelcomePage />} />
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;
