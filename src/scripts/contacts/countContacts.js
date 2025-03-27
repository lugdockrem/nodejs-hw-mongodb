// export const countContacts = async () => {};

// console.log(await countContacts());

import { readContacts } from "../../utils/contacts/readContacts.js";

const countContacts = async()=> {
    const contacts = await readContacts();
    return contacts.length;
};

console.log(await countContacts());