import mongoose from "mongoose";
import { generateUsername } from "../../guard.mjs";
import { app } from "../../index.mjs";
import User from "./users.model.mjs";

app.get("/users", async (req, res) => {
    const users = await User.find();
    res.send(users);
});

app.get("/users/:id", async (req, res) => {
    const { id } = req.params;
    if (mongoose.Types.ObjectId.isValid(id)) {
        const user = await User.findById(id);
        if (!user) {
            return res.status(403).send("User not found.");
        }
        res.send(user);
    } else {
        res.status(403).send("Invalid user id.");
    }
});
