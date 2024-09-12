import { getUser_jwt, registered_user_guard } from "../../guard.mjs";
import { app } from "../../index.mjs";
import postValidationSchema from "./posts.joi.mjs";
import Post from "./posts.model.mjs";
import { getPost, postCreator_admin_guard } from "./postsGuard.mjs";

app.get("/posts", async (req, res) => {
    try {
        const posts = await Post.find();
        res.send(posts);
    } catch (err) {
        res.status(500).send(err.message ? err.message : "Server error.");
    }
});
app.get("/posts/user-posts/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const posts = await Post.find({ user_id: id });
        res.send(posts);
    } catch (err) {
        res.status(500).send(err.message ? err.message : "Server error.");
    }
});
app.get("/posts/:id", async (req, res) => {
    const post = await getPost(req, res);
    if (!post) {
        return res.status(403).send("Post not found.");
    }
    res.send(post);
});
app.post("/posts", registered_user_guard, async (req, res) => {
    const { title, subtitle, content, image, video } = req.body;
    const { error } = postValidationSchema.validate(req.body, {
        allowUnknown: true,
    });
    if (error) {
        return res.status(403).send(error.details[0].message);
    }
    const user = await getUser_jwt(req, res);
    if (!user) {
        return res.status(403).send("User not found.");
    }
    const user_id = user._id.toString();
    try {
        const newPost = new Post({
            title,
            subtitle,
            content,
            image,
            video,
            user_id,
        });
        await newPost.save();
        res.send(newPost);
    } catch (err) {
        res.status(500).send(err.message ? err.message : "Server error.");
    }
});
app.put("/posts/:id", postCreator_admin_guard, async (req, res) => {
    const { title, subtitle, content, image, video } = req.body;
    const { error } = postValidationSchema.validate(req.body, {
        allowUnknown: true,
    });
    if (error) {
        return res.status(403).send(error.details[0].message);
    }
    try {
        const post = await getPost(req, res);
        if (!post) {
            return res.status(403).send("Post not found.");
        }
        post.title = title;
        post.subtitle = subtitle;
        post.content = content;
        post.image = image;
        post.video = video;

        await post.save();
        res.send(post);
    } catch (err) {
        res.status(500).send(err.message ? err.message : "Server error.");
    }
});
app.patch("/posts/:id", registered_user_guard, async (req, res) => {
    const post = await getPost(req, res);
    if (!post) {
        return res.status(403).send("Post not found.");
    }
    const user = await getUser_jwt(req, res);
    if (!user) {
        return res.status(403).send("User not found.");
    }
    if (user.deleted) {
        return res
            .status(401)
            .send("Unauthronized: deleted user can't like a post.");
    }
    const userId = user.id.toString();
    const userIndex = post.likes.indexOf(userId);
    if (userIndex === -1) {
        post.likes.push(userId);
    } else {
        post.likes.splice(userIndex, 1);
    }

    try {
        await post.save();
        res.send(post);
    } catch (err) {
        res.status(500).send(err.message ? err.message : "Server error.");
    }
});
app.delete("/posts/:id", postCreator_admin_guard, async (req, res) => {
    const post = await getPost(req, res);
    if (!post) {
        return res.status(403).send("Post not found.");
    }
    post.deleted = true;
    try {
        await post.save();
        res.send(post);
    } catch (err) {
        res.status(500).send(err.message ? err.message : "Server error.");
    }
});
