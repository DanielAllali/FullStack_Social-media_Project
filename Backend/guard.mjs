import User from "./handlers/users/users.model.mjs";
import jwt from "jsonwebtoken";

const the_registered_user_guard = (req, res, next) => {
    const { id } = req.params;
    if (!req.headers.authorization) {
        return res.status(403).send("Need to provide user jwt token.");
    }
    const decoded = jwt.verify(
        req.headers.authorization,
        process.env.JWT_SECRET
    );
    if (decoded.isAdmin) {
        next();
        return;
    }
    if (id !== decoded._id) {
        return res
            .status(401)
            .send(
                "Unauthronized: only the registered user or admin can change this."
            );
    } else {
        next();
    }
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

export { generateUsername, the_registered_user_guard };
