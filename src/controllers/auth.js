import { registerUser, loginUser, refreshUser, logoutUser, sendResetEmail } from "../services/auth.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import createHttpError from "http-errors";
import UserCollection from "../db/models/User.js";
import SessionCollection from "../db/models/Session.js";
import { getEnvVar } from "../utils/getEnvVar.js";

const JWT_SECRET = getEnvVar("JWT_SECRET");

const setupSession = (res, session) => {
   res.cookie("refreshToken", session.refreshToken, { 
      httpOnly: true,
      expires: session.refreshTokenValidUntil,
   });
   
   res.cookie("sessionId", session._id, {
      httpOnly: true,
      expires: session.refreshTokenValidUntil,
   });
};

export const registerController = async(req, res)=> {
   const user = await registerUser(req.body);

   res.status(201).json({
      status: 201,
      message: "Successfully register a user",
      data:user,
   });
};

export const loginController = async(req, res)=> {
const session = await loginUser(req.body);

setupSession(res, session);

res.json({
   status: 200,
   message: "Successfully logged in an user!",
data: {
   accessToken: session.accessToken,
    }
  });
};

export const refreshController = async(req, res)=> {
  const session = await refreshUser(req.cookies);

  setupSession(res, session);

res.json({
   status: 200,
   message: "Session successfully refreshed!",
data: {
   accessToken: session.accessToken,
    }
  });
};

export const logoutController = async(req, res)=> {
    if(req.cookies.sessionId) {
await logoutUser(req.cookies.sessionId);
    }

    res.clearCookie("sessionId");
    res.clearCookie("refreshToken");

    res.status(204).send();
};

// 

export const sendResetEmailController = async (req, res) => {
   try {
     await sendResetEmail(req.body); 
     
     res.json({
       status: 200,
       message: "Reset password email has been successfully sent.",
       data: {}
     });
   } catch (error) {
     console.error("Error in sendResetEmailController:", error);
     // Надсилаємо клієнту помилку, але не даємо серверу впасти
     res.status(error.status || 500).json({
       status: error.status || 500,
       message: error.message || "Internal server error",
       data: {}
     });
   }
};

 export const resetPasswordController = async (req, res) => {
   const { token, password } = req.body;
   
   try {
     // Перевіряємо токен
     const decodedToken = jwt.verify(token, JWT_SECRET);
     const { email } = decodedToken;
     
     // Шукаємо користувача за email
     const user = await UserCollection.findOne({ email });
     if (!user) {
       throw createHttpError(404, "User not found!");
     }
     
     // Хешуємо новий пароль
     const hashedPassword = await bcrypt.hash(password, 10);
     
     // Оновлюємо пароль користувача
     await UserCollection.findByIdAndUpdate(user._id, { password: hashedPassword });
     
     // Видаляємо поточну сесію користувача
     await SessionCollection.deleteMany({ userId: user._id });
     
     // Надсилаємо успішну відповідь
     res.status(200).json({
       status: 200,
       message: "Password has been successfully reset.",
       data: {}
     });
   } catch (error) {
     if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
       throw createHttpError(401, "Token is expired or invalid.");
     }
     throw error;
   }
};
