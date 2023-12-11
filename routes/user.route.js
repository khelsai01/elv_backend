const userRouter = require("express").Router();
const { UserModel } = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { BlacklistModel } = require("../middleware/Blacklist");
const { auth } = require("../middleware/auth.middleware");

userRouter.post("/register",async(req,res)=>{
    const {name,email,gender,password} = req.body;

    try {
    
        const existUser = await UserModel.findOne({email});
        if(existUser){
            return res.status(200).send({msg:`The Email ${email} is already in user collection login please`})
        }
        else{
            const hashpass= bcrypt.hashSync(password,5);

            const user = new UserModel({
                name,
                email,
                gender,
                password:hashpass

            })

            await user.save();
            return res.status(200).send({msg:"new user has been registered","new_user":user});
        }
    } catch (error) {
        return res.status(400).send({error:error.message});
    }
});

userRouter.post("/login",async(req,res)=>{
    const {email,password} = req.body;
    try {
        
        const user = await UserModel.findOne({email});
        if(user){
            bcrypt.compare(password,user.password, (err,result)=>{
                if(err){
                    return res.status(400).send({msg:"password not match login again"})
                }
                else{
                    const token = jwt.sign({userId:user._id},"token",{expiresIn:"1h"});
                    return res.status(200).send({msg:"user has been logged in ","token":token})
                }
            })
        }
    } catch (error) {
        return res.status(400).send({error:error.message});
        
    }
});

userRouter.get("/logout",auth,async(req,res)=>{
    const token = req.headers.authorization?.split(" ")[1];
    try {

        const blacklistToken =new BlacklistModel({token});
        await blacklistToken.save();
        return res.status(200).send({msg:"user has been logged out"})
    } catch (error) {
        return res.status(400).send({error:error.message});
        
    }
});

module.exports ={userRouter};