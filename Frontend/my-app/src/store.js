import { configureStore } from "@reduxjs/toolkit";
import TiktakSlice from "./components/TiktakSlice";

export default configureStore({
    reducer: {
        tiktak: TiktakSlice,
    },
});
