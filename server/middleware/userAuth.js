import jwt from "jsonwebtoken";



export async function userAuth(req,res,next){
    const {token}=req.cookies;

    if(!token){
        return res.json({success:false,message:"Not Authorized.Login Again"});
    }

    try {
        

        const tokendecode=jwt.verify(token,process.env.JWT_SECRET_KEY);

        if(tokendecode.id){
            req.body.userId=tokendecode.id;
        }else{
            return res.json({success:false,message:"Not Authorized.Login Again"});
        }


        next();
    } catch (error) {
        res.json({success:false,message:error.message});
    }
} 