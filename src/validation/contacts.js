import Joi from "joi";

import { typeList } from "../constants/contacts.js";

export const contactAddSchema = Joi.object({
    name: Joi.string().required().messages({
        "any.required": "Треба вказати ім'я",
        "string.base": "Номер телефону має бути строкою "
    }),
    phoneNumber: Joi.string().required(),
    isFavourite: Joi.boolean(),
    contactType: Joi.string().valid(...typeList),
});

export const contactUpdateSchema = Joi.object({
    name: Joi.string(),
    phoneNumber: Joi.string(),
    isFavourite: Joi.boolean(),
    contactType: Joi.string().valid(...typeList),
});