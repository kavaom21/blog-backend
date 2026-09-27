 import User from "./user.model.js";
import { sendError ,sendSuccess } from "../commanUtils.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";       

export const register = async(req , res) => {

    try {

    const {name , email , password} = req.body;

    const userexist = await User.findOne({email});

    if(userexist){
        return sendError(res , "User already exist with this mail");
    }

    const hash = await  bcrypt.hash(password,10);

    const user = await User.create({name : name , email : email , password: hash });

    const jwttoken = jwt.sign({id : user._id} , process.env.JWT_SECRET ,{expiresIn :"1d" });


    return sendSuccess(res , "user created successfully" ,  {jwttoken} , 201);

        
    } catch (error) {

        return sendError(res , "INTERNAL ERRROR" ,500);
        
    }
}

export const login = async(req , res) => {

    try {

      const {email , password} = req.body;

      const user = await User.findOne({email});

      if(!user){
        return sendError(res , "User not found" , 404);
      }

      const checkPass = await bcrypt.compare(password , user.password);

      if(!checkPass){
        return sendError(res , "Email or Password is Incorrect" , 400);
      }

    const jwttoken = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1d" });

      return sendSuccess(res , "User login Successfully" , {jwttoken} , 200);

        
    } catch (error) {
        return sendError(res ,"INTERNAL ERROR" ,500)
    }


}