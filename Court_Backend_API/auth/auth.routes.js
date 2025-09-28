//Project Imports
const authRouter = require('express').Router()
const authController = require('./auth.controller')


// routes 
authRouter.post('/register', authController.registerUser)
authRouter.post("/login", authController.loginUser)
authRouter.post("/forgort-password", authController.forgotPassword)
authRouter.post("/reset-password", authController.resetPassword)
authRouter.post("/send-otp", authController.sendOtp);
authRouter.post("/verify-otp", authController.verifyOtp);
authRouter.get("/user/:user_id", authController.getUserById)
// for update 
authRouter.put("/update-user/:user_id", authController.updateUser)


module.exports= authRouter
