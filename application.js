const express = require('express')
const AppError = require('./utils/error')
const bodyParser = require('body-parser')
const errController = require('./controller/errorController')
const app = express();

const dotenv = require('dotenv')
dotenv.config({path:'./conf.env'})

const rateLimit = require('express-rate-limit')
const userrouter = require('./routes/userrouter')

const limiter = rateLimit({
    max : 50,
    windowMs : 60*60*1000,
    message : "too many requests from this IP, Please try again in one hour"
})

app.use('/v1',limiter);

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

app.use('/v1/user',userrouter)

app.use((req,res,next)=>{
    next(new AppError('Invalid Url found',404))
})

app.use(errController.errformat)
module.exports = app