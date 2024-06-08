import jwt, { decode } from "jsonwebtoken";
import Doctor from "../models/DoctorSchema.js";
import User from "../models/UserSchema.js";


export const authenticate = async (req, res, next) =>{

    //token retrive from headers

    const authToken = req.headers.authorization;

    //'bearer' actual token 
    //check if the token exsits or not 
    if (!authToken || !authToken.startsWith("Bearer ")) {
        return res
        .status(401)
        .json({success:false, message:"No token, authorization denied"});
    }
    try{

        const token = authToken.split("")[1];

        //verify token 
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)

        req.userId =decoded.userId
        req.role = decoded.role
        next();   //must call next function to work 
     } catch (err){
        if(err.name=='TokenExpiredError'){
            return res.status(401).json({message:'Token is expired'})
        }
        return res.status(401).json({success:false, messgae:'Invalid Token'})
     }
};

export const restrict = roles=> async (req,res,next) =>{
    const userId = req.userId

    let user;
    const patient = await User.findById(userId)
    const doctor = await Doctor.findById(userId)

 
    if(patient){
        user = patient
    }
    if(doctor){
        user = doctor
    }
    if(!roles.includes(user.role)){
        return res.status(401).json({success:false, message:"You are not authorized "})
    }
    next();
};