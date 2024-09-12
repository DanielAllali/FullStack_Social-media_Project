import Joi from "joi";
import mongoose from "mongoose";

const messageSchema = Joi.object({
    deleted: Joi.boolean().default(false),
    content: Joi.string().trim().max(300).required().messages({
        "string.base": "Content should be a string.",
        "string.empty": "Content cannot be empty.",
        "any.required": "Content is required.",
    }),
    likes: Joi.array()
        .items(
            Joi.string().custom((value, helpers) => {
                if (!mongoose.Types.ObjectId.isValid(value)) {
                    return helpers.message("Invalid user ID.");
                }
                return value;
            })
        )
        .default([]),
    user_id: Joi.string()
        .custom((value, helpers) => {
            if (!mongoose.Types.ObjectId.isValid(value)) {
                return helpers.message("Invalid user ID.");
            }
            return value;
        })
        .required()
        .messages({
            "any.required": "User ID is required.",
        }),
    post_id: Joi.string()
        .custom((value, helpers) => {
            if (!mongoose.Types.ObjectId.isValid(value)) {
                return helpers.message("Invalid post ID.");
            }
            return value;
        })
        .required()
        .messages({
            "any.required": "Post ID is required.",
        }),
});

export default messageSchema;
