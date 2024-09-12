import mongoose from "mongoose";
import { app } from "../../index.mjs";
import Message from "./messages.model.mjs";
import { getMessage } from "./messagesGuard.mjs";
import User from "../users/users.model.mjs";
import Post from "../posts/posts.model.mjs";

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
app.get("/message/post-messages/:postId", async (req, res) => {
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
app.get("/message/user-messages/:userId", async (req, res) => {
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
