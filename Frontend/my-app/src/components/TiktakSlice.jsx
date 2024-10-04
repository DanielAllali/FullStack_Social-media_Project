import React from "react";
import { createSlice } from "@reduxjs/toolkit";
if (!localStorage.getItem("Language")) {
    localStorage.setItem("Language", "EN");
}
if (!localStorage.getItem("Theme")) {
    localStorage.setItem("Theme", "light");
}
const lightTheme = {
    type: "light",
    bgc: "#F0F2F5",
    weak: "#fff",
    strong: "#000",
    highlight_weak: "#519bfc",
    highlight_strong: "#1877F2",
};
const darkTheme = {
    type: "dark",
    bgc: "#18191A",
    weak: "#242526",
    strong: "#fff",
    highlight_weak: "#519bfc",
    highlight_strong: "#1877F2",
};
const initialState = {
    language: localStorage.getItem("Language"),
    theme: localStorage.getItem("Theme") == "dark" ? darkTheme : lightTheme,
    user: null,
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
            state.theme = newTheme.payload;
            localStorage.setItem("Theme", "custom");
        },
        login: (state, newUser) => {
            state.user = newUser.payload;
        },
        logout: (state) => {
            state.user = null;
        },
    },
});

export const {
    setLanguage,
    setDarkTheme,
    setLightTheme,
    setCustomTheme,
    login,
    logout,
} = tiktakSlice.actions;

export default tiktakSlice.reducer;
