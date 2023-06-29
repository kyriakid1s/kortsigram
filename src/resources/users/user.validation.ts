import Joi from 'joi';

const register = Joi.object({
    username: Joi.string().max(30).required(),
    email: Joi.string().required(),
    password: Joi.string().min(8).alphanum().required(),
});

const login = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().min(8).required(),
});

export default { register, login };
