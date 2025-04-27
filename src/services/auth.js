import bcrypt from "bcrypt";
import createHttpError from 'http-errors';
import {randomBytes} from "node:crypto";

import UserCollection from '../db/models/User.js';
import SessionCollection from "../db/models/Session.js";

import { accessTokenLifeTime, refreshTokenLifeTime } from "../constants/auth.js";
import jwt from 'jsonwebtoken';
import { sendResetPasswordEmail } from '../utils/emailService.js';

const createSession = ()=> {
  const accessToken = randomBytes(30).toString("base64");
  const refreshToken = randomBytes(30).toString("base64");
  const accessTokenValidUntil = Date.now() + accessTokenLifeTime;
  const refreshTokenValidUntil = Date.now() + refreshTokenLifeTime;

  return {
    accessToken,
    refreshToken,
    accessTokenValidUntil,
    refreshTokenValidUntil,
  };
};

export const findSession = query => SessionCollection.findOne(query);

export const findUser = query => UserCollection.findOne(query);

export const registerUser = async payload => {
  const {email, password} = payload;
  const user = await findUser({email});
  if (user) {
    throw createHttpError(409, 'Email already in use');
  }

  const hashPassword = await bcrypt.hash(password, 10);
  
  const newUser = await UserCollection.create({ ...payload, password: hashPassword });

  // Видаляємо пароль з об'єкта перед поверненням
  const userData = newUser.toObject();
  delete userData.password;

  return userData;
};

export const loginUser = async payload => {
const {email, password} = payload;
const user = await findUser({email});
if(!user) {
  throw createHttpError(401, "Email or password invalid");
}

const passwordCompare = await bcrypt.compare(password, user.password);
if(!passwordCompare) {
  throw createHttpError(401, "Email or password invalid");
}

await SessionCollection.findOneAndDelete({userId: user._id});

const session = createSession();

return SessionCollection.create({
  userId: user._id,
  ...session,
  });
};

     export const refreshUser = async ({refreshToken, sessionId})=> {
          const session = await findSession({refreshToken, _id: sessionId});
          if(!session) {
            throw createHttpError(401, "Session not found");
          }
          
          if(session.refreshTokenValidUntil < Date.now()) {
           await SessionCollection.findOneAndDelete({_id: session._id});
            throw createHttpError(401, "Session token expired");
          }

          await SessionCollection.findOneAndDelete({_id: session._id});

         const newSession = createSession();

return SessionCollection.create({
  userId: session.userId,
  ...newSession, 
  });   
};

export const logoutUser = sessionId => SessionCollection.deleteOne({_id: sessionId});

export const sendResetEmail = async ({ email }) => {
  // Перевіряємо, чи існує користувач з таким email
  const user = await UserCollection.findOne({ email });
  
  if (!user) {
    throw createHttpError(404, "User not found!");
  }
  
  // Створюємо токен скидання пароля з часом життя 5 хвилин
  const { JWT_SECRET } = process.env;
  const payload = { email: user.email };
  const resetToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '5m' });
  
  try {
    // Намагаємося надіслати email
    const emailSent = await sendResetPasswordEmail(user.email, resetToken);
    
    if (!emailSent) {
      throw createHttpError(500, "Failed to send the email, please try again later.");
    }
    
    return true;
  } catch (error) {
    console.error("Error sending reset email:", error);
    
    // Перевіряємо, чи є помилка вже HttpError
    if (error.status && error.message) {
      throw error;
    } else {
      // Створюємо HttpError із правильним повідомленням
      throw createHttpError(500, "Failed to send the email, please try again later.");
    }
  }
};
