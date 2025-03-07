import express from "express";
import cors from "cors";
import 'dotenv/config';
import cookieParser from "cookie-parser";
import connectDB from "./config/mongodb.js";
import authRoute from "./routes/authRoutes.js";
import userRoute from "./routes/userRoutes.js";
import { userAuth } from "./middleware/userAuth.js";

const app=express();
const port=process.env.PORT;

connectDB();

const allowedOrigins=['http://localhost:5173']

app.use(express.json());
app.use(cors({
    origin: allowedOrigins,
    credentials: true
}))
app.use(cookieParser());


app.use("/auth",authRoute);
app.use("/user",userAuth,userRoute);


app.get('/',(req,res)=>{
    res.send("API working");
})


app.listen(port,()=>{
        console.log(`Server is running on port ${port}`);
})