import {Router} from "express";

import { ctrlWrapper } from "../utils/ctrlWrapper.js";

import { getContactsController, getContactsByIdController } from "../controllers/contacts.js";

const contactsRouter = Router();

contactsRouter.get("/", ctrlWrapper(getContactsController));

contactsRouter.get("/:id", ctrlWrapper(getContactsByIdController));

export default contactsRouter;