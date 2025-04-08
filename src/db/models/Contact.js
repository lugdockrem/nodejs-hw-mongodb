import {Schema, model} from "mongoose";

import { typeList } from "../../constants/contacts.js";

const ContactSchema = new Schema({
    name: {
        type: String,
        required: [true, "Прізвище обов'язкове!"],
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    isFavourite: {
        type: Boolean,
        default: false,
        required: true,
    },
    contactType: {
        type: String,
        enum: typeList,
        default: typeList[0],
        required: true,
    },
},   
{
    timestamps: true,
    versionKey: false,
  },
);

const ContactCollection = model("contact", ContactSchema);

export default ContactCollection;
