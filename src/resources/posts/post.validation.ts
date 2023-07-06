import Joi from 'joi';

const post = Joi.object({
    imageURL: Joi.string().required(),
    author: Joi.string().required(),
});

export default post;
