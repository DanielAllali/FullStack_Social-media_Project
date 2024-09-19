import Joi from "joi";
import mongoose from "mongoose";

const messageValidationSchema = Joi.object({
    content: Joi.string().trim().max(300).required().messages({
        "string.base": "Content should be a string.",
        "string.empty": "Content cannot be empty.",
        "any.required": "Content is required.",
    }),
});

export default messageValidationSchema;
