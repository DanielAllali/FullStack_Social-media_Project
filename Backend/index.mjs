import express from "express";
import fs, { stat } from "fs";
import cors from "cors";
import mongoose from "mongoose";
import chalk from "chalk";
import dotenv from "dotenv";
import morgan from "morgan";
import moment from "moment";
import path from "path";

dotenv.config();

async function main() {
    await mongoose.connect(
        process.env.NODE_ENV === "development"
            ? process.env.MONGO_URI
            : process.env.MONGO_ATLAS_URI
    );
    console.log("mongodb connected");
}

main().catch((err) => console.log(err));

export const app = express();

app.use(express.json());
app.use(express.static("public"));

app.use(
    cors({
        origin: ["http://localhost:3000"],
        credentials: true,
        methods: "GET,PUT,POST,PATCH,DELETE,OPTIONS",
        allowedHeaders: "*",
    })
);

app.listen(process.env.PORT, () => {
    console.log(`listening on port ${process.env.PORT}`);
});
app.get("/", (req, res) => {
    res.send({
        message: "Welcome to my project!",
    });
});

(async () => {
    await import("./handlers/users/users.mjs");
    await import("./handlers/posts/posts.mjs");
    await import("./handlers/messages/messages.mjs");
    await import("./initial-data/initial-data.service.mjs");

    app.get("*", (req, res) => {
        res.sendFile(path.resolve("error-page.html"));
    });
})();
