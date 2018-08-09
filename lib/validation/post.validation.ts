import { IPost as PostModel } from '../../models/Post'
import Joi from 'joi'
export  const validatePostFields = (model : PostModel)  =>  {
    
    const schema = Joi.object().keys({
        header: Joi.string().required().trim(),
        text: Joi.string().required().trim(),
        isPrivate : Joi.boolean().required(),
        tags: Joi.array(),
        author : Joi.object()
    }).with('fullName', ['password', 'isPrivate', 'tags'])

    return Joi.validate(model, schema)
}
