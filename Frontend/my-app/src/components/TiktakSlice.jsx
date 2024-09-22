import React from "react";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    language: "EN",
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
            state.language = language;
        },
        setTheme: (state, newTheme) => {
            state.theme = newTheme;
        },
    },
});

export const { setLanguage, setTheme } = tiktakSlice.actions;

export default tiktakSlice.reducer;
