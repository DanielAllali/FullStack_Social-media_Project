import Joi from "joi";

const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d!@#$%^&*_-]{8,20}$/;

const userLoginValidationSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().pattern(passwordRegex).required(),
});

const userRegisterValidationSchema = Joi.object({
    username: Joi.string().min(2).max(15).required(),
    name: Joi.object({
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
    }).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().allow(""),
    password: Joi.string().pattern(passwordRegex).required(),
});

export { userLoginValidationSchema, userRegisterValidationSchema };
