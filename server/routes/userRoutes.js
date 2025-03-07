import express from "express";
import { getUserData } from "../controllers/userController.js";

const userRoute=express.Router();


userRoute.get("/user-data",getUserData);

export default userRoute;