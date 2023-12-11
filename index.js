const express = require("express");
const { connection } = require("./db");
const { userRouter } = require("./routes/user.route");
const { postsRouter } = require("./routes/posts.route");

const app = express();

app.use(express.json());

app.use("/users",userRouter);
app.use("/posts",postsRouter);

app.listen(8080,async()=>{
    try {
        await connection;
        console.log("server has been connected to db");
        console.log("server has been runnig at port 8080");

    } catch (error) {
        console.log(error)
    }
})