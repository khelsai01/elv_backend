const jwt = require("jsonwebtoken");
const { BlacklistModel } = require("./Blacklist");

const auth = async(req,res,next)=>{

    const token = req.headers.authorization?.split(" ")[1];
    try {
        const existToken = await BlacklistModel.findOne({token});
        if(existToken){
            return res.status(400).send({msg:"login again please"})
        }
        else{
            jwt.verify(token,"token", (err,decode)=>{
                if(decode){
                    req.body.userId =decode.userId;
                    next();
                }
            })
        }
        
    } catch (error) {
        return res.status(400).send(error)
    }
};

module.exports ={auth};