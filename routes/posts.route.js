const postsRouter = require("express").Router();
const { PostsModel } = require("../models/posts.model");
const { auth } = require("../middleware/auth.middleware");

postsRouter.use(auth);

postsRouter.get("/",async(req,res)=>{

    const {title,device1,device2} = req.query;
    const query ={};
    const {userId} =req.body; 

    if(userId){
        query.userId= userId;
    }
    if(title){
        query.title = title;
    }
    if(device1&& device2){
        query.device= {$and:[{device:device1},{device:device2}]};
    }
    else if(device1){
        query.device = device1;
    }
    try {
        const posts = await PostsModel.find(query);
        return res.status(200).send(posts);
    } catch (error) {
        return res.status(400).send({error:error.message});
        
    }
});
postsRouter.post("/add",async(req,res)=>{

    try {
        const posts = new PostsModel(req.body);
        await posts.save();
        return res.status(200).send({msg:"new posts had been added","new_post":posts});
    } catch (error) {
        return res.status(400).send({error:error.message});
        
    }
});

postsRouter.patch("/update/:postId",async(req,res)=>{
    const {postId} = req.params
    const {userId} = req.body;
    try {
         
        await PostsModel.findByIdAndUpdate({userId,_id:postId},req.body);
        return res.status(200).send({msg:"posts has updated"});
    } catch (error) {
        return res.status(400).send({error:error.message});
        
    }
});

postsRouter.delete("/delete/:postId",async(req,res)=>{
    const {postId} = req.params
    const {userId} = req.body;
    try {
         
        await PostsModel.findByIdAndDelete({userId,_id:postId});
        return res.status(200).send({msg:"posts has Deleted"});
    } catch (error) {
        return res.status(400).send({error:error.message});
        
    }
});

module.exports ={postsRouter}