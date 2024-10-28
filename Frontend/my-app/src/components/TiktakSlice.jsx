import React from "react";
import { createSlice } from "@reduxjs/toolkit";
if (!localStorage.getItem("Language")) {
    localStorage.setItem("Language", "EN");
}
if (!localStorage.getItem("Theme")) {
    localStorage.setItem("Theme", "light");
}
const light = {
    type: "light",
    bgc: "#F0F2F5",
    weak: "#ffffff",
    strong: "#000000",
    highlight_weak: "#519bfc",
    highlight_strong: "#1877F2",
};
const dark = {
    type: "dark",
    bgc: "#18191A",
    weak: "#242526",
    strong: "#ffffff",
    highlight_weak: "#519bfc",
    highlight_strong: "#1877F2",
};
const lightCrimson = {
    type: "lightCrimson",
    bgc: "#F0F2F5",
    weak: "#ffffff",
    strong: "#000000",
    highlight_weak: "#dc143c",
    highlight_strong: "#A4001D",
};
const darkCrimson = {
    type: "darkCrimson",
    bgc: "#18191A",
    weak: "#242526",
    strong: "#ffffff",
    highlight_weak: "#dc143c",
    highlight_strong: "#A4001D",
};
const lightPink = {
    type: "lightPink",
    bgc: "#F0F2F5",
    weak: "#ffffff",
    strong: "#000000",
    highlight_weak: "#ff69b4",
    highlight_strong: "#FF1493",
};
const darkPink = {
    type: "darkPink",
    bgc: "#18191A",
    weak: "#242526",
    strong: "#ffffff",
    highlight_weak: "#ff69b4",
    highlight_strong: "#FF1493",
};
const themes = { light, dark, lightCrimson, darkCrimson, lightPink, darkPink };
let currentThemeObj = themes[localStorage.getItem("Theme")];

const initialState = {
    language: localStorage.getItem("Language"),
    theme: currentThemeObj === "" ? light : currentThemeObj,
    user: null,
    displayRefreshBtn: false,
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
            if (themes.filter((t) => t === newTheme.payload).length === 0) {
                state.theme = newTheme.payload;
                localStorage.setItem("Theme", newTheme.payload);
            }
        },
        login: (state, newUser) => {
            state.user = newUser.payload;
        },
        logout: (state) => {
            state.user = null;
        },
        setDisplayRefreshBtn: (state) => {
            state.displayRefreshBtn = true;
        },
    },
});

export const { setLanguage, setTheme, login, logout, setDisplayRefreshBtn } =
    tiktakSlice.actions;

export default tiktakSlice.reducer;
