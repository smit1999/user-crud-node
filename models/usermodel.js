const mongoose = require('../server/db')
const bcrypt = require('bcryptjs') 
const userSchema = mongoose.Schema({
    name: String,
    username: {
        type:String,
        required:[true,'please enter a username'],
        unique:true
    },
    email: {
        type:String,
        required:[true,'please enter the email'],
        unique:true
    },
    password : {
        type:String,
        required:[true,'please set a password'],
        minlength:8,
        select:false
    },
    passwordconfirm : {
        type:String,
        required:[true,'please confirm the password'],
        minlength:8,
        validate:{
            validator: function(el){
                return el === this.password;
            },
            message : 'Passwords must match !'

        },
        select : false
    },
    role:{
        type:String,
        enum : ['user', 'admin'],
        default:'user'
    }
})

userSchema.pre('save', async function(next){
if(!this.isModified('password')) return next()

 this.password = await bcrypt.hash(this.password, 12);

 this.passwordconfirm = null;
 next();
})

userSchema.methods.correctPassword = async function(candidatePassword, userPassword){
    return await bcrypt.compare(candidatePassword,userPassword);
}


module.exports = mongoose.model('users',userSchema)
