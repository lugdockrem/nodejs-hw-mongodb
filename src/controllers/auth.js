import { registerUser } from "../services/auth.js";

export const registerController = async(req, res)=> {
   await registerUser(req.body);

   res.json({
    message: "Successfully register user"
   });
};