import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
    {
        deleted: {
            type: Boolean,
            default: false,
        },
        title: {
            type: String,
            required: true,
            trim: true,
        },
        subtitle: {
            type: String,
            trim: true,
        },
        content: {
            type: String,
            required: true,
        },
        image: {
            url: {
                type: String,
                trim: true,
            },
            alt: {
                type: String,
                trim: true,
            },
        },
        video: {
            src: {
                type: String,
                trim: true,
            },
            alt: {
                type: String,
                trim: true,
            },
        },
        likes: {
            type: [mongoose.Schema.Types.ObjectId],
            default: [],
            ref: "User",
            required: true,
        },
        messages: {
            type: [mongoose.Schema.Types.ObjectId],
            default: [],
            ref: "Message",
            required: true,
        },
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User",
        },
    },
    { timestamps: { createdAt: true, updatedAt: false } }
);

const Post = mongoose.model("Post", postSchema);

export default Post;
