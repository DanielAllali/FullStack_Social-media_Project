import mongoose from "mongoose";

const { Schema, model } = mongoose;

const userSchema = new Schema(
    {
        deleted: {
            type: Boolean,
            default: false,
        },
        username: {
            type: String,
            required: true,
        },
        name: {
            firstName: {
                type: String,
                required: true,
            },
            lastName: {
                type: String,
                required: true,
            },
        },
        bio: {
            type: String,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        phone: {
            type: String,
        },
        password: {
            type: String,
            required: true,
        },
        sandbox: [
            {
                content: String,
                image: String,
                createdAt: Date,
            },
        ],
        image: {
            src: {
                type: String,
                required: true,
            },
            alt: {
                type: String,
            },
        },
        posts: [
            {
                type: Schema.Types.ObjectId,
                ref: "Post",
            },
        ],
        saved_posts: [
            {
                type: Schema.Types.ObjectId,
                ref: "Post",
            },
        ],
        followers: [
            {
                type: Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        isAdmin: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: { createdAt: true, updatedAt: true } }
);

const User = model("User", userSchema);

export default User;
