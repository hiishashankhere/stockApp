import Joi from 'joi'

export const validation = (req,res,next)=>{
    const{name,email,password,mobile}= req.body
    const userInfo ={
        name,email,password,mobile
    }
    const schema = Joi.object({
        name:Joi.string().min(5).max(30).required(),
        email:Joi.string().email().required(),
        password:Joi.string().min(3).max(8).required(),
        mobile:Joi.string().pattern(/[6-9]{1}[0-9]{9}/).required()
    })
    const {error} = schema.validate(userInfo,/* {abortEarly:true} */)
    if(error){
        res.status(400).json({
            success:false,
            message:error.details[0].message
        })
    }else{
        next()
    }
}

