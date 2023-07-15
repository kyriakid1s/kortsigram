import Joi from 'joi';

const postComment = Joi.object({
    comment: Joi.string().required(),
});

export default { postComment };
