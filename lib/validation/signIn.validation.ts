import ValidationConfig from '../../const/validationConfig.constant'
import Joi from 'joi'
export  const validateSignInFields = (email : string, password : string)  =>  {

    const data = {
        email : email,
        password : password
    }
    
    const schema = Joi.object().keys({
        email: Joi.string().email().required().trim(),
        password: Joi.string().required().min(ValidationConfig.PASSWORD_LENGTH).trim()
    }).with('fullName', 'password')

    return Joi.validate(data, schema)
}
