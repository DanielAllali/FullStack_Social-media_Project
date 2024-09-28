import React from "react";
import { createSlice } from "@reduxjs/toolkit";
if (!localStorage.getItem("Language")) {
    localStorage.setItem("Language", "EN");
}
if (!localStorage.getItem("Theme")) {
    localStorage.setItem("Theme", "light");
}
const lightTheme = {
    weak: "#fff",
    strong: "#000",
    highlight_weak: "#519bfc",
    highlight_strong: "#1877F2",
};
const darkTheme = {
    weak: "#000",
    strong: "#fff",
    highlight_weak: "#519bfc",
    highlight_strong: "#1877F2",
};
const initialState = {
    language: localStorage.getItem("Language"),
    theme: localStorage.getItem("Theme") == "dark" ? darkTheme : lightTheme,
};

const tiktakSlice = createSlice({
    name: "tiktakSlice",
    initialState,
    reducers: {
        setLanguage: (state, language) => {
            state.language = language.payload;
            localStorage.setItem("Language", language.payload);
        },
        setLightTheme: (state) => {
            state.theme = lightTheme;
            localStorage.setItem("Theme", "light");
        },
        setDarkTheme: (state) => {
            state.theme = darkTheme;
            localStorage.setItem("Theme", "dark");
        },
        setCustomTheme: (state, newTheme) => {
            state.theme = newTheme;
            localStorage.setItem("Theme", "custom");
        },
    },
});

export const { setLanguage, setDarkTheme, setLightTheme, setCustomTheme } =
    tiktakSlice.actions;

export default tiktakSlice.reducer;
