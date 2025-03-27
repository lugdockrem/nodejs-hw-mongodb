import { readContacts } from "../../utils/contacts/readContacts.js";

const getAllContacts = ()=> readContacts();

console.log(await getAllContacts());

// export const getAllContacts = async () => {};


