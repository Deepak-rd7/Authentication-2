import userModel from "../models/userModel.js";



export async function getUserData(req,res) {
    try {
        const {userId}=req.body;

        const user=await userModel.findById(userId);

        if(!user){
            res.json({success:false,message:"user Not found"})
        }

        res.json({
            success:true,
            userData:{
                name:user.name,
                isAccountVerified:user.isAccountVerified
            }
        })
    } catch (error) {
        res.json({success:false,message:error.message})
    }

}