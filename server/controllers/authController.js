import userModel from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import transporter from "../config/nodemailer.js"; 
import { EMAIL_VERIFY_TEMPLATE,PASSWORD_RESET_TEMPLATE } from "../config/emailTemplates.js";


export async function register(req,res) {
    

    const {name,email,password}=req.body;

    if(!name || !email || !password){
        return res.json({
            success:false,
            message:"Missing Details"
        })
    }

    try {
        
        const existingUser=await userModel.findOne({email});
        if(existingUser){
            return res.json({
                success:false,
                message:"User already available please Log In"
            })
        }


        const hashedPassword=await bcrypt.hash(password,10);

        const newUser=new userModel({
            name,
            email,
            password:hashedPassword
        })

        await newUser.save();

        const token=jwt.sign({id:newUser._id},process.env.JWT_SECRET_KEY,{
            expiresIn:'7d'
        })

        res.cookie('token',token,{
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite:process.env.NODE_ENV==='production'?
            'none':'strict',
            maxAge:7 * 24 * 60 * 60 * 1000

        })
        // sending welcome email
        const mailOptions={
           from: process.env.SENDER_EMAIL,
            to:email,
            subject:'Welcome to mern-auth',
            text:`Welcome your account has been created ${email}`,

        }

        await transporter.sendMail(mailOptions);
   

         res.status(200).json({
            success:true,
            message:"Registered Successfully"
        })

    } catch (error) {
         res.status(400).json({
            success:false,
            message:error.message
        })
    }
}


export async function login(req,res) {
    const {email,password}=req.body;

    if(!email || !password){
        return res.json({
            success:false,
            message:"Email and password are required"
        })
    }

    try {
        
            const user=await userModel.findOne({email})

            if(!user){
                return res.json({
                    success:false,
                    message:"User not Exists please register"
                })
            }

            const isMatch=await bcrypt.compare(password,user.password);

            if(!isMatch){
                return res.json({
                    success:false,
                    message:"Incorrect Password"
                })
            }

            const token=jwt.sign({id:user._id},process.env.JWT_SECRET_KEY,{
                expiresIn:'7d'
            })


            res.cookie('token',token,{
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite:process.env.NODE_ENV==='production'?
                'none':'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000
    
            })
    
            res.status(200).json({
                success:true,
                message:"Logined Successfully"
            })



    } catch (error) {
        return res.json({
            message:error.message
        })
    }
}


export async function logout(req,res) {
    try {
        res.clearCookie('token',{
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite:process.env.NODE_ENV==='production'?
            'none':'strict',
        })

        return res.json({
            success:"true",
            message:"Logged Out"
        })
        
    } catch (error) {
        return res.json({
            success:"false",
            message:error.message
        })
    }
}


//sending otp to mail that we register
export async function sendVerifyOtp(req,res) {
    try {
        const {userId}=req.body;
       
        const user=await userModel.findById(userId);

        if(user.isAccountVerified){
            return res.json({success: false,message:"Account Already Verified"})
        }

        const otp=String(Math.floor( 100000 + Math.random() * 900000));

        user.verifyOtp=otp;

        user.verifyOtpExpiresAt = Date.now() + 24*60*60*1000;

        await user.save();

        const mailOptions={
            from: "Deepak <ravishankardeepak8@gmail.com>",
            to:user.email,
            subject:'Account Verification OTP',
            // text:`Your Otp is ${otp}.Verify your account using this OTP`,
            html: EMAIL_VERIFY_TEMPLATE.replace("{{otp}}",otp).replace("{{email}}",user.email)

        }

        await transporter.sendMail(mailOptions);

        res.json({success:true,message:"Verification otp is send to email"})

    } catch (error) {
        res.json({success:"false",message:error.message})
        console.log(error);
    }
}


//verifying the email by  entering the crct otp
export async function verifyEmail(req,res) {

    const {userId,otp}=req.body;

    if(!userId || !otp){
        return res.json({success:false,message:"Missing Details"})
    }

    try {
        const user=await userModel.findById(userId);

        if(!user){
            return res.json({success:false,message:"user not found"})
        }

        if(user.verifyOtp='' ||  user.verifyOtp!==otp){
                return res.json({success:false,message:"Invalid OTP"})
        } 

        if(user.verifyOtpExpireAt < Date.now()){
            return res.json({success:false,message:"OTP Expired"})
        }

            user.isAccountVerified=true;

            user.verifyOtp='';
        
            user.verifyOtpExpiresAt=0;
        
            await user.save();
        
            return res.json({success:true,message:"Email verified Successfully"});
        
        
    
    }
        
        catch (error) {
        res.json({success:false,message:error.message})
    }


  
}


export async function isAuthenticated(req,res) {
    
    try {
        res.json({success:"true"})
    } catch (error) {
        res.json({success:"false",message:error.message});
    }

    
}

//send password reset OTP
export async function sentResetOtp(req,res) {
    const {email}=req.body;

    if(!email){
        return res.json({success:false,
            message:"Email Required"
        })
    }

    try {

        const user=await userModel.findOne({email});
        if(!user){
            return res.json({success:false,message:"user not found"})
        }

        const otp=String(Math.floor( 100000 + Math.random() * 900000));

        user.resetOtp=otp;

        user.resetOtpExpiresAt = Date.now() + 15*60*1000;

        await user.save();

        const mailOptions={
            from: "Deepak <ravishankardeepak8@gmail.com>",
            to:user.email,
            subject:'Password reset OTP',
            text:`Your Otp for resetting your password is ${otp}.Use this OTP to proceed with resetting your password`,
            html:PASSWORD_RESET_TEMPLATE.replace("{{otp}}",otp).replace("{{email}}",email)

        }

        await transporter.sendMail(mailOptions);

        return res.json({success:true,message:"OTP sent to your email"})



    } catch (error) {
        return res.json({success:false,message:error.message})
    }
    
}


//Reset User password

export async function resetPassword(req,res) {
try {
    const {email,otp,newPassword}=req.body;

    if(!email || !otp ||!newPassword){
        return res.json({success:false,message:"Email,OTP,Newpassword is required"});
    }

    const user=await userModel.findOne({email});

    if(!user){
        return res.json({success:false,message:"User not found"});
    }

    if(user.resetOtp==='' || user.resetOtp!==otp){
        return res.json({success:false,message:"Invalid OTP"});
    }

    if(user.resetOtpExpiresAt < Date.now()){
        return res.json({success:false,message:"OTP Expired"});
    }

    const hashedPassword=await bcrypt.hash(newPassword,10);
    user.password=hashedPassword;

    user.resetOtp='';
    user.resetOtpExpiresAt=0;

    await user.save();
    return res.json({success:true,message:"Password has been resetted Successfully"});

    
} catch (error) {
    return res.json({success:false,message:error.message});
}
   
}





