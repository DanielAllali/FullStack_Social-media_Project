import mongoose from "mongoose";
import { app } from "../../index.mjs";
import User from "./users.model.mjs";
import {
    userEditValidationSchema,
    userLoginValidationSchema,
    userRegisterValidationSchema,
} from "./users.joi.mjs";
import bcrypt from "bcrypt";
import { generateUsername, the_registered_user_guard } from "../../guard.mjs";
import jwt from "jsonwebtoken";

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

app.post("/users", async (req, res) => {
    const { username, name, email, phone, password, image } = req.body;

    if ((await User.find({ email })).length > 0) {
        return res.status(409).send("User with that email already exsists.");
    }
    const { error } = userRegisterValidationSchema.validate(req.body, {
        allowUnknown: true,
    });
    if (error) {
        return res.status(403).send(error.details[0].message);
    }

    try {
        const newUser = new User({
            username,
            name,
            email,
            phone,
            password,
            image,
        });
        newUser.password = await bcrypt.hash(newUser.password, 10);
        if (newUser.username == "") {
            newUser.username = await generateUsername();
        }
        console.log(newUser);

        await newUser.save();
        res.send(newUser);
    } catch (err) {
        res.status(500).send("Server error.");
    }
});

app.post("/users/login", async (req, res) => {
    const { email, password } = req.body;
    const { error } = userLoginValidationSchema.validate(req.body, {
        allowUnknown: true,
    });
    if (error) {
        return res.status(403).send(error.details[0].message);
    }

    const user = await User.findOne({ email });
    if (!user) {
        return res.status(403).send("Email or password uncorrect.");
    }
    if (!user.password || !(await bcrypt.compare(password, user.password))) {
        return res.status(403).send("Email or password uncorrect.");
    }
    const token = jwt.sign(
        {
            _id: user._id,
            username: user.username,
            name: user.name,
            isAdmin: user.isAdmin,
            email: user.email,
            createdAt: user.createdAt,
        },
        process.env.JWT_SECRET,
        { expiresIn: "30h" }
    );
    res.send(token);
});

app.put("/users/:id", the_registered_user_guard, async (req, res) => {
    const { id } = req.params;
    const { username, bio, name, image } = req.body;
    if (await User.findOne({ username })) {
        return res.status(409).send("This username is taken.");
    }

    const user = await User.findById(id);
    if (!user) {
        return res.status(403).send("User not found.");
    }

    const validate = userEditValidationSchema.validate(req.body, {
        allowUnknown: true,
    });
    if (validate.error) {
        return res.status(403).send(validate.error.details[0].message);
    }

    user.username = username;
    user.bio = bio;
    user.name = name;
    user.image = image;
    try {
        await user.save();
        res.send(user);
    } catch (err) {
        res.status(500).send(err.message ? err.message : "Server error.");
    }
});
