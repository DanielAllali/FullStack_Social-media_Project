import React from "react";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    language: "EN",
};

const tiktakSlice = createSlice({
    name: "tiktakSlice",
    initialState,
    reducers: {
        setLanguage: (state, language) => {
            state.language = language;
        },
    },
});

export const { setLanguage } = tiktakSlice.action;

export default tiktakSlice.reducer;
