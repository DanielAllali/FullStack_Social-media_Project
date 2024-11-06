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
    registered_user_guard,
    the_registered_user_guard,
} from "../../guard.mjs";
import jwt from "jsonwebtoken";
import { getPost } from "../posts/postsGuard.mjs";
import path from "path";
import express from "express";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import multer from "multer";
import fs from "fs";
import nodemailer from "nodemailer";

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

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "../../public/images"));
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const extension = path.extname(file.originalname);
        cb(null, `${file.fieldname}-${uniqueSuffix}${extension}`);
    },
});
const upload = multer({ storage });
app.post("/users", upload.single("image"), async (req, res) => {
    try {
        const { error } = userRegisterValidationSchema.validate(req.body, {
            allowUnknown: true,
        });
        if (error) {
            if (req.file) {
                fs.unlinkSync(req.file.path);
            }
            return res.status(403).send(error.details[0].message);
        }

        const { username, name, email, phone, password } = req.body;

        if (await User.findOne({ email })) {
            return res.status(409).send("User with that email already exists.");
        }

        const newUser = new User({
            username: username || (await generateUsername()),
            name,
            email,
            phone,
            password,
            image: {
                src: `http://localhost:9999/images/${req.file.filename}`,
                alt: `${username || "user"} profile picture`,
            },
        });

        newUser.password = await bcrypt.hash(newUser.password, 10);
        await newUser.save();
        res.send(newUser);
    } catch (err) {
        if (req.file) {
            fs.unlinkSync(req.file.path);
        }
        res.status(500).send(err.message ? err.message : "Server error.");
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
            followers: user.followers,
            deleted: user.deleted,
            createdAt: user.createdAt,
        },
        process.env.JWT_SECRET,
        { expiresIn: "30h" }
    );
    res.send(token);
});

app.put(
    "/users/:id",
    the_registered_user_guard,
    upload.single("image"),
    async (req, res) => {
        const { id } = req.params;
        const { username, bio, name } = req.body;

        if (req.file) {
            const validImageTypes = ["image/jpeg", "image/png", "image/gif"];
            if (!validImageTypes.includes(req.file.mimetype)) {
                fs.unlinkSync(req.file.path);
                return res
                    .status(400)
                    .send("Only JPEG, PNG, and GIF files are allowed.");
            }
        }

        if (
            (await User.findOne({ username })) &&
            (await User.findOne({ username }))?._id?.toString() !== id
        ) {
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
            if (req.file) {
                fs.unlinkSync(req.file.path);
            }
            return res.status(403).send(validate.error.details[0].message);
        }

        user.username = username;
        user.bio = bio;
        user.name = name;
        user.image = {
            src: `${
                req.file
                    ? "http://localhost:9999/images/" + req.file.filename
                    : user.image.src
            }`,
            alt: user.image.alt,
        };
        try {
            await user.save();
            const token = jwt.sign(
                {
                    _id: user._id,
                    username: user.username,
                    name: user.name,
                    isAdmin: user.isAdmin,
                    email: user.email,
                    image: user.image,
                    followers: user.followers,
                    deleted: user.deleted,
                    createdAt: user.createdAt,
                },
                process.env.JWT_SECRET,
                { expiresIn: "30h" }
            );
            res.send(token);
        } catch (err) {
            if (req.file) {
                fs.unlinkSync(req.file.path);
            }
            res.status(500).send(err.message ? err.message : "Server error.");
        }
    }
);

app.delete("/users/:id", the_registered_user_guard, async (req, res) => {
    const { id } = req.params;
    const { password } = req?.query;

    const user = await User.findById(id);
    const userDeleting = await getUser_jwt(req, res);
    if (!user) {
        return res.status(404).send("User not found.");
    }
    if (!userDeleting) {
        return res.status(404).send("User not found.");
    }
    if (!password && !userDeleting.isAdmin) {
        return res.status(403).send("You need to provide password.");
    }
    if (
        password &&
        !(await bcrypt.compare(password, user.password)) &&
        !user.isAdmin
    ) {
        return res.status(401).send("Password incorrect.");
    }

    user.deleted = true;
    try {
        await user.save();
        res.send(user);
    } catch (err) {
        res.status(500).send(err.message ? err.message : "Server error.");
    }
});
app.put("/users/restore-user/:id", admin_guard, async (req, res) => {
    const { id } = req.params;

    const user = await User.findById(id);
    const userRestoring = await getUser_jwt(req, res);
    if (!user) {
        return res.status(404).send("User not found.");
    }
    if (!userRestoring) {
        return res.status(404).send("User not found.");
    }
    user.deleted = false;
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
app.post("/users/sandbox/:id", registered_user_guard, async (req, res) => {
    try {
        const user = await getUser(req, res);
        if (!user) {
            return res.status(403).send("User not found.");
        }
        const { content } = req.body;
        const userSendMessage = await getUser_jwt(req, res);

        if (!userSendMessage) {
            return res.status(403).send("User not found.");
        }

        if (!content) {
            return res.status(403).send('Object must contain "content".');
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

        const newSandbox = [
            ...user.sandbox,
            {
                content,
                userSendId: userSendMessage._id,
                createdAt: new Date(),
            },
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

app.get("/user/change-password/:email", async (req, res) => {
    try {
        const { email } = req.params;
        if (!email) {
            return res.status(403).send("Need to provide email.");
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(403).send("No user with that email.");
        }
        let code = "";
        for (let i = 0; i < 6; i++) {
            code += Math.floor(Math.random() * 10);
        }
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.APP_EMAIL,
                pass: process.env.GOOGLE_APP_PASSWORD /* google app password */,
            },
        });

        const mailOptions = {
            from: process.env.APP_EMAIL,
            to: email,
            subject: "Tiktak sends you verification code!",
            text: `Hi ${user.name.firstName} ${user.name.lastName} your code is: ${code}`,
        };

        transporter.sendMail(mailOptions, async function (error, info) {
            if (error) {
                res.send(error);
            } else {
                user.temporaryCode = await bcrypt.hash(code, 10);
                await user.save();
                const token = jwt.sign(
                    {
                        code,
                    },
                    process.env.JWT_SECRET,
                    { expiresIn: "1m" }
                );
                res.send(token);
            }
        });
    } catch (err) {
        res.send(err.message ? err.message : "Server error.");
    }
});
app.put("/user/change-password/:email", async (req, res) => {
    try {
        const { password, code } = req.body;
        const { email } = req.params;
        if (!email) {
            return res.status(403).send("Need to provide email.");
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(403).send("No user with that email.");
        }
        const regex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d!@#$%^&*_-]{8,20}$/;
        if (!regex.test(password)) {
            return res
                .status(403)
                .send(
                    "Password must be 8-20 characters long, include at least one uppercase letter and one number."
                );
        }

        if (!(await bcrypt.compare(code, user.temporaryCode))) {
            return res.status(403).send("Code does not match");
        }
        user.temporaryCode = "";
        user.password = await bcrypt.hash(password, 10);
        await user.save();
        res.send(user);
    } catch (err) {
        res.send(err.message ? err.message : "Server error.");
    }
});
