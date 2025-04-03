import Contactcollection from "../db/models/Contact.js";

export const getContacts = ()=> Contactcollection.find();

export const getContactsById = id => Contactcollection.findOne({_id: id});

