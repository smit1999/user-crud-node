const User = require('../models/usermodel');
const AppError = require('../utils/error');
const jwt =  require('jsonwebtoken')
const {promisify} = require('util')

const signtoken = (id)=>{
    return jwt.sign({id:id},process.env.JWT_SECRET,{
        expiresIn: process.env.JWT_EXPIRES
    })
} 

exports.signup = async(req,res, next)=>{
    try{
    const newuser = await User.create(req.body);

    const token = signtoken(newuser._id)

    res.status(201).json({
        'message':'User Registered successfully',
        data:{
            token : token,
            user:newuser
        }
    })
}catch(err){
    next(new AppError(`${err}`,500))
}
}

exports.login = async (req,res,next)=>{
    try{
    const email = req.body.email
    const password = req.body.password
    if (!email || !password){
        return next(new AppError('please enter email and password',400))
    }
   const user = await User.findOne({email:email}).select('+password');

   if(user && await user.correctPassword(password,user.password)){

    const token = signtoken(user._id)
    return res.status(200).json({
    message:'user logged-in',
    'data':{
        'token':token,
        'email':email,
        'name':user.name,
        'username': user.username
    }
   })
   }
   return next(new AppError('Invalid email or password',400))

   
}catch(err){
    next(new AppError(err,500))
}
}

exports.authenticate = async ( req,res,next)=>{
    try{
        let token ;
        // check for token
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
            token = req.headers.authorization.split(' ')[1];
        }
        
        else{
            return next(new AppError('Token not valid',401));
        }

        // validate the token

        decoded = await promisify(jwt.verify)(token,process.env.JWT_SECRET);

        console.log(decoded)

        // check if user exists in the system

        userdata = await User.findById(decoded.id);

        if(!userdata){
            return next(new AppError('User does not exist',401))
        }

        req.user = userdata
        next();

    }catch(err){
        next(new AppError(err,500))
    }
}

exports.restrictTo = (...roles)=>{
    try{
    return (req,res,next)=>{
        if(!roles.includes(req.user.role)){
            return next(new AppError('The user does not have permission to perform this action',403))
        }
        next()
    }
    }catch(err){
        return next(new AppError(err,500))
    }
}   