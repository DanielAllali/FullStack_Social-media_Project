import mongoose from "mongoose";
import Post from "./posts.model.mjs";
import jwt from "jsonwebtoken";

const getPost = async (req, res) => {
    const { id } = req.params;
    if (mongoose.Types.ObjectId.isValid(id)) {
        const post = await Post.findById(id);
        if (!post) {
            return null;
        }
        return post;
    } else {
        return null;
    }
};
const postCreator_admin_guard = async (req, res, next) => {
    const { id } = req.params;
    const post = await Post.findById(id);
    if (!post) {
        return res.status(403).send("Post not found.");
    }
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
        if (post.user_id.toString() === decoded._id.toString()) {
            next();
            return;
        } else {
            return res
                .status(401)
                .send("Unauthronized: only the creator of the card or admin.");
        }
    } catch (err) {
        if (err.name === "TokenExpiredError") {
            return res.status(401).send("Unauthorized: JWT has expired.");
        } else {
            throw err;
        }
    }
};
export { getPost, postCreator_admin_guard };
