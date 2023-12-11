const mongoose = require("mongoose");


const postsSchema = mongoose.Schema({
    title:String,
    body:String,
    device:String,
    userId:String
},{versionKey:false});

const PostsModel = mongoose.model("post",postsSchema);

module.exports ={PostsModel};