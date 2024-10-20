import mongoose from "mongoose";
import { app } from "../../index.mjs";
import User from "./users.model.mjs";
import {
    userEditValidationSchema,
    userLoginValidationSchema,
    userRegisterValidationSchema,
} from "./users.joi.mjs";
import bcrypt from "bcrypt";
import {
    admin_guard,
    generateUsername,
    getUser,
    getUser_jwt,
    the_registered_user_guard,
} from "../../guard.mjs";
import jwt from "jsonwebtoken";
import { getPost } from "../posts/postsGuard.mjs";
import path from "path";
import express from "express";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

app.get("/users", async (req, res) => {
    const users = await User.find();
    res.send(users);
});

app.get("/users/:id", async (req, res) => {
    const user = await getUser(req, res);
    if (!user) {
        return res.status(403).send("User not found.");
    }
    res.send(user);
});

app.post("/users", async (req, res) => {
    const { username, name, email, phone, password, image } = req.body;

    if ((await User.find({ email })).length > 0) {
        return res.status(409).send("User with that email already exists.");
    }
    if (image.alt == "") {
        image.alt = `${username} profile picture`;
    }
    const { error } = userRegisterValidationSchema.validate(req.body, {
        allowUnknown: true,
    });
    if (error) {
        return res.status(403).send(error.details[0].message);
    }
    if (image.src == "") {
        image.src = `${process.env.URL}/user/profile-picture`;
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
            image: user.image,
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

app.delete("/users/:id", the_registered_user_guard, async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
        return res.status(403).send("User not found.");
    }

    user.deleted = true;
    try {
        await user.save();
        res.send(user);
    } catch (err) {
        res.status(500).send(err.message ? err.message : "Server error.");
    }
});
app.patch("/users/admin/:id", admin_guard, async (req, res) => {
    const user = await getUser(req, res);
    if (!user) {
        return res.status(403).send("User not found.");
    }
    user.isAdmin = !user.isAdmin;
    try {
        await user.save();
        res.send(user);
    } catch (err) {
        res.status(500).send(err.message ? err.message : "Server error.");
    }
});
app.post("/users/sandbox/:id", async (req, res) => {
    try {
        const user = await getUser(req, res);
        if (!user) {
            return res.status(403).send("User not found.");
        }
        const { content, image } = req.body;

        if (!content || !image) {
            return res
                .status(403)
                .send('Object must contain "content" and "image".');
        }
        if (content.en) {
            for (const c in content) {
                if (content[c].length < 1 || content[c].length >= 40) {
                    return res
                        .status(403)
                        .send(
                            'Content must be an object with two keys "he" "en" and with value between 1-40 characters.'
                        );
                }
            }
        } else {
            return res
                .status(403)
                .send(
                    'Content must be an object with two keys "he" "en" and with value between 1-40 characters.'
                );
        }
        const urlRegex =
            /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(:\d+)?(\/[^\s]*)?$/;

        if (!urlRegex.test(image)) {
            return res.status(403).send("Invalid image URL.");
        }
        const newSandbox = [
            ...user.sandbox,
            { content, image, createdAt: new Date() },
        ];
        user.sandbox = newSandbox;
        await user.save();
        res.send(user);
    } catch (err) {
        res.status(500).send(err.message ? err.message : "Server error.");
    }
});
app.patch("/users/follow/:id", async (req, res) => {
    try {
        const follower = await getUser_jwt(req, res);
        if (!follower) {
            return res.status(403).send("User jwt token not found.");
        }
        const user = await getUser(req, res);
        if (!user) {
            return res.status(403).send("User not found.");
        }
        if (user._id.toString() === follower._id.toString()) {
            return res
                .status(401)
                .send("Unauthronized: user can't follow itself.");
        }
        const userId = follower._id.toString();
        const userIndex = user.followers.indexOf(userId);
        if (userIndex === -1) {
            user.followers.push(userId);
        } else {
            user.followers.splice(userIndex, 1);
        }
        await user.save();
        res.send(user);
    } catch (err) {
        res.status(500).send(err.message ? err.message : "Server error.");
    }
});
app.patch("/users/save-post/:id", async (req, res) => {
    try {
        const user = await getUser_jwt(req, res);
        if (!user) {
            return res.status(403).send("User jwt token not found.");
        }
        const post = await getPost(req, res);
        if (!post) {
            return res.status(403).send("Post jwt token not found.");
        }
        const postId = post._id.toString();
        const postIndex = user.saved_posts.indexOf(postId);
        if (postIndex === -1) {
            user.saved_posts.push(postId);
        } else {
            user.saved_posts.splice(postIndex, 1);
        }
        await user.save();
        res.send(user);
    } catch (err) {
        res.status(500).send(err.message ? err.message : "Server error.");
    }
});
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/media", express.static(path.join(__dirname, "media")));

app.get("/user/profile-picture", (req, res) => {
    const colors = ["Black", "Blue", "Green", "Orange"];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    const imagePath = path.join(
        __dirname,
        "../../media/userProfile",
        `user${randomColor}.png`
    );

    res.sendFile(imagePath, (err) => {
        if (err) {
            res.status(500).send("Error loading image");
        }
    });
});
