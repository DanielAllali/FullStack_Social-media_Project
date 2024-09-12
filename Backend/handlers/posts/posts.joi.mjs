import Joi from "joi";

const postValidationSchema = Joi.object({
    title: Joi.string().trim().min(1).max(50).required(),
    subtitle: Joi.string().trim().allow("").max(50),
    content: Joi.string().trim().min(1).max(300).required(),
    image: Joi.object({
        src: Joi.string().required().max(100),
        alt: Joi.string().max(50),
    }).required(),
    video: Joi.object({
        src: Joi.string().required().max(100),
        alt: Joi.string().max(50),
    }).required(),
});

export default postValidationSchema;