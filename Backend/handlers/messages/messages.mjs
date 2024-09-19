import mongoose from "mongoose";
import { app } from "../../index.mjs";
import Message from "./messages.model.mjs";
import { getMessage } from "./messagesGuard.mjs";
import User from "../users/users.model.mjs";
import Post from "../posts/posts.model.mjs";
import { getUser_jwt } from "../../guard.mjs";
import messageValidationSchema from "./messages.joi.mjs";
import { getPost } from "../posts/postsGuard.mjs";

app.get("/messages", async (req, res) => {
    try {
        const messages = await Message.find();
        res.send(messages);
    } catch (err) {
        res.status(500).send(err.message ? err.message : "Server error.");
    }
});
app.get("/messages/:id", async (req, res) => {
    try {
        const message = await getMessage(req, res);
        if (!message) {
            return res.status(403).send("Message not found.");
        }
        res.send(message);
    } catch (err) {
        res.status(500).send(err.message ? err.message : "Server error.");
    }
});
app.get("/messages/post-messages/:postId", async (req, res) => {
    try {
        const { postId } = req.params;
        if (!mongoose.Types.ObjectId.isValid(postId)) {
            return res.status(403).send("Invalid post id.");
        }
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(403).send("Post not found.");
        }
        const messages = await Message.find({ post_id: postId.toString() });
        res.send(messages);
    } catch (err) {
        res.status(500).send(err.message ? err.message : "Server error.");
    }
});
app.get("/messages/user-messages/:userId", async (req, res) => {
    try {
        const { userId } = req.params;
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(403).send("Invalid user id.");
        }
        const user = await User.findById(userId);
        if (!user) {
            return res.status(403).send("User not found.");
        }
        const messages = await Message.find({ user_id: userId.toString() });
        res.send(messages);
    } catch (err) {
        res.status(500).send(err.message ? err.message : "Server error.");
    }
});
app.patch("/messages/:id", async (req, res) => {
    const message = await getMessage(req, res);
    if (!message) {
        return res.status(403).send("Message not found.");
    }
    const user = await getUser_jwt(req, res);
    if (!user) {
        return res.status(403).send("User not found.");
    }
    if (user.deleted) {
        return res
            .status(401)
            .send("Unauthronized: deleted user can't like a message.");
    }
    const userId = user.id.toString();
    const userIndex = message.likes.indexOf(userId);
    if (userIndex === -1) {
        message.likes.push(userId);
    } else {
        message.likes.splice(userIndex, 1);
    }

    try {
        await message.save();
        res.send(message);
    } catch (err) {
        res.status(500).send(err.message ? err.message : "Server error.");
    }
});
app.post("/messages/:id", async (req, res) => {
    const user = await getUser_jwt(req, res);
    if (!user) {
        return res.status(403).send("User not found.");
    }
    const { content } = req.body;
    const { error } = messageValidationSchema.validate(req.body, {
        allowUnknown: true,
    });
    if (error) {
        return res.status(403).send(error.details[0].message);
    }
    const post = await getPost(req, res);
    if (!post) {
        return res.status(403).send("Post not found.");
    }
    try {
        const newMessage = new Message({
            content,
            user_id: user._id,
            post_id: post._id,
        });
        await newMessage.save();
        res.send(newMessage);
    } catch (err) {
        return res
            .status(500)
            .send(err.message ? err.message : "Server error.");
    }
});
app.delete("/message/:id", async (req, res) => {
    const user = await getUser_jwt(req, res);
    if (!user) {
        return res.status(403).send("User not found.");
    }
    const message = await getMessage(req, res);
    if (!message) {
        return res.status(403).send("Message not found.");
    }
    if (message.user_id.toString() !== user._id.toString() && !user.isAdmin) {
        return res
            .status(401)
            .send(
                "Unauthronized: only the user who created this card or admin can delete this card."
            );
    }
    try {
        message.deleted = true;
        await message.save();
        res.send(message);
    } catch (err) {
        res.status(500).send(err.message ? err.message : "Server error.");
    }
});
