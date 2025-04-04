import {Schema, model} from "mongoose";

const ContactSchema = new Schema({
    name: {
        type: String,
        required: true,
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
        enum: ["work", "home", "personal"],
        default: "home",
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
