import { Router } from "express";

import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {validateBody} from '../utils/validateBody.js';

import { authRegisterSchema } from "../validation/auth.js";

import { registerController } from "../controllers/auth.js";

const authRouter = Router();

//signup
authRouter.post("/register", ctrlWrapper(registerController));

export default authRouter;