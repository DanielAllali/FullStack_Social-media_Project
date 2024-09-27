import React from "react";
import { createSlice } from "@reduxjs/toolkit";
if (!localStorage.getItem("Language")) {
    localStorage.setItem("Language", "EN");
}
const initialState = {
    language: localStorage.getItem("Language"),
    theme: {
        weak: "#fff",
        strong: "#000",
        highlight_weak: "#519bfc",
        highlight_strong: "#1877F2",
    },
};

const tiktakSlice = createSlice({
    name: "tiktakSlice",
    initialState,
    reducers: {
        setLanguage: (state, language) => {
            state.language = language.payload;
            localStorage.setItem("Language", language.payload);
        },
        setTheme: (state, newTheme) => {
            state.theme = newTheme;
        },
    },
});

export const { setLanguage, setTheme } = tiktakSlice.actions;

export default tiktakSlice.reducer;
