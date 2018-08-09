import { IUser as UserModel } from '../../models/User'
import ValidationConfig from '../../const/validationConfig.constant'
import Joi from 'joi'
export  const validateSignUpFields = (model: UserModel)  =>  {
    
    const schema = Joi.object().keys({
        fullName: Joi.string().required().max(ValidationConfig.FULL_NAME_LENGTH).trim(),
        email: Joi.string().email().required().trim(),
        password: Joi.string().required().min(ValidationConfig.PASSWORD_LENGTH).trim()
    }).with('fullName', ['email', 'password'])

    return Joi.validate(model, schema)
}
