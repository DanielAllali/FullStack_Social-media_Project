import mongoose from "mongoose";
import User from "./handlers/users/users.model.mjs";
import jwt from "jsonwebtoken";
import Post from "./handlers/posts/posts.model.mjs";

const the_registered_user_guard = (req, res, next) => {
    const { id } = req.params;

    if (!req.headers.authorization) {
        return res.status(403).send("Need to provide user jwt token.");
    }
    try {
        const decoded = jwt.verify(
            req.headers.authorization,
            process.env.JWT_SECRET
        );
        if (decoded.isAdmin) {
            next();
            return;
        }
        console.log(decoded);

        if (id !== decoded._id && !decoded.isAdmin) {
            return res
                .status(401)
                .send(
                    "Unauthronized: only the registered user or admin can change this."
                );
        } else {
            next();
        }
    } catch (err) {
        if (err.name === "TokenExpiredError") {
            return res.status(401).send("Unauthorized: JWT has expired.");
        } else {
            throw err;
        }
    }
};
const admin_guard = (req, res, next) => {
    if (!req.headers.authorization) {
        return res.status(403).send("Need to provide user jwt token.");
    }
    try {
        const decoded = jwt.verify(
            req.headers.authorization,
            process.env.JWT_SECRET
        );
        if (decoded.isAdmin) {
            next();
            return;
        } else {
            return res.status(401).send("Unauthronized: only admin.");
        }
    } catch (err) {
        if (err.name === "TokenExpiredError") {
            return res.status(401).send("Unauthorized: JWT has expired.");
        } else {
            return res.status(500).send(err.message);
        }
    }
};
const registered_user_guard = (req, res, next) => {
    if (!req.headers.authorization) {
        return res.status(403).send("Need to provide user jwt token.");
    }
    next();
};

const generateUsername = async () => {
    const users = await User.find();
    const letters = [
        "a",
        "b",
        "c",
        "d",
        "e",
        "f",
        "g",
        "h",
        "i",
        "j",
        "k",
        "l",
        "m",
        "n",
        "o",
        "p",
        "q",
        "r",
        "s",
        "t",
        "u",
        "v",
        "w",
        "x",
        "y",
        "z",
    ];

    const numbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
    let username = "";
    let generated = false;

    while (!generated) {
        username = "User";
        for (let i = 1; i <= 11; i++) {
            username +=
                Math.random() < 0.5
                    ? letters[Math.floor(Math.random() * letters.length)]
                    : numbers[Math.floor(Math.random() * numbers.length)];
        }
        const existingUser = await User.findOne({ username });
        if (!existingUser) {
            generated = true;
        } else {
            username = "";
        }
    }

    return username;
};
const getUser = async (req, res) => {
    const { id } = req.params;
    if (mongoose.Types.ObjectId.isValid(id)) {
        const user = await User.findById(id);
        if (!user) {
            return null;
        }
        return user;
    } else {
        return null;
    }
};
const getUser_jwt = async (req, res) => {
    if (!req.headers.authorization) {
        return null;
    }
    try {
        const decoded = jwt.verify(
            req.headers.authorization,
            process.env.JWT_SECRET
        );
        return await User.findById(decoded._id);
    } catch (err) {
        if (err.name === "TokenExpiredError") {
            return null;
        } else {
            return null;
        }
    }
};

export {
    generateUsername,
    the_registered_user_guard,
    admin_guard,
    getUser,
    registered_user_guard,
    getUser_jwt,
};
