import Post from "../handlers/posts/posts.model.mjs";
import User from "../handlers/users/users.model.mjs";
import initialData from "./initial-data.mjs";
import bcrypt from "bcrypt";

(async () => {
    const userAmount = await User.find().countDocuments();
    const postAmount = await Post.find().countDocuments();
    if (!userAmount) {
        for (const u of initialData.users) {
            const user = new User(u);
            user.password = await bcrypt.hash(user.password, 10);
            await user.save();
        }
    }
    if (!postAmount) {
        for (const p of initialData.posts) {
            const post = new Post(p);
            const users = await User.find();
            post.user_id = users[Math.floor(Math.random() * users.length)];
            await post.save();
        }
    }
})();
