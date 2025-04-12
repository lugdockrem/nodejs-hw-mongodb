import Joi from "joi";

import { typeList } from "../constants/contacts.js";

export const contactAddSchema = Joi.object({
    name: Joi.string().min(3).max(30).required().messages({
        "any.required": "Треба вказати ім'я",
        "string.base": "Номер телефону має бути строкою "
    }),
    email: Joi.string().email().required(),
    phoneNumber: Joi.string().min(3).max(30).required(),
    isFavourite: Joi.boolean(),
    contactType: Joi.string().min(3).max(30).valid(...typeList),
    });

export const contactUpdateSchema = Joi.object({
    name: Joi.string().min(3).max(30),
    email: Joi.string().email(),
    phoneNumber: Joi.string().min(3).max(30),
    isFavourite: Joi.boolean(),
    contactType: Joi.string().min(3).max(30).valid(...typeList),
    });