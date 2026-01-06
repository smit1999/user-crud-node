const express = require('express')

userrouter = express.Router()

usercontroller = require('../controller/usercontroller')
authcontroller = require('../controller/authController')

userrouter
.post('/signup',authcontroller.signup)
.post('/login',authcontroller.login)


userrouter
.route('/')
.get(authcontroller.authenticate, usercontroller.getallusers)
.post(usercontroller.checkdata,usercontroller.createuser)
.patch(usercontroller.updateuser)
.delete(authcontroller.authenticate,
        authcontroller.restrictTo('admin'),
        usercontroller.deleteuser)

userrouter
.route('/:id')
.get(usercontroller.getuser)

module.exports = userrouter
