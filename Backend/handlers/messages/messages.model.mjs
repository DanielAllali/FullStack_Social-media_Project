import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
    {
        deleted: {
            type: Boolean,
            default: false,
            required: true,
        },
        content: {
            type: String,
            required: true,
            trim: true,
        },
        likes: {
            type: [mongoose.Schema.Types.ObjectId],
            default: [],
            ref: "User",
            required: true,
        },
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User",
        },
        post_id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "Post",
        },
    },
    { timestamps: { createdAt: true, updatedAt: true } }
);

const Message = mongoose.model("Message", messageSchema);

export default Message;
