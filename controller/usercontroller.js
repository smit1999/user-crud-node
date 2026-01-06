const model = require('../models/usermodel')
const AppError = require('../utils/error')

exports.checkdata = (req,res,next)=>{
    try{
    if(!req.body || !req.body.username || !req.body.name || !req.body.email){

    const err = new AppError('name , username or email is missing',400)
    next(err)
    }
    next()
}catch(err){
    next(new AppError(String(err),500))
}
}
exports.getuser = async (req,res)=>{
    
    const user =  await model.find({username:req.params.id})

    var message = 'User Not Found'
    if(user.length != 0){
        message = "User Found"
    }

    return res.status(200).json({
        message: message,
        users:user
})
}

exports.getallusers = async (req,res)=>{
    
    let user =  model.find({})
    
    user =  user.sort('-_id')

    user =  user.select(['username','name','email'])

    const val = await user;

    var message = 'User Not Found'
    if(val.length != 0){
        message = "User Found"
    }

    return res.status(200).json({
        message: message,
        users:val
})
}
exports.createuser = async (req, res, next) =>{

    try{

    const user = await model.find({username:req.body.username});

    if (user.length!=0){
        next(new AppError('user already exist',400,{user:{}}))
    }

    else{
    await model.create(
        {
        name: req.body.name,
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,
        passwordconfirm: req.body.confirmpassword
    })
    .then(user=>{
        return res.status(201).json({
        message:'user created',
        user : user
    });
 }) 
} 
}catch(err){
    next(new AppError(String(err),500))
} 
}

exports.updateuser = async (req, res) =>{

    userdata = await model.findOneAndUpdate({username:req.body.username},
        {email:req.body.email,name:req.body.name},
        {new: true}
    )
  
    return res.status(201).json({
        message:'user update',
        user : userdata
    });
}

exports.deleteuser = async (req,res)=>{
    const user = await model.deleteMany({username:req.body.username})

    return res.status(200).json({
        message:"users deleted",
        count:user.deletedCount
    })
}