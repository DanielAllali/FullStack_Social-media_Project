import WelcomePage from "./components/welcomePage/WelcomePage";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
    return (
        <div className="App">
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<WelcomePage />} />
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;
