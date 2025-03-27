// export const removeLastContact = async () => {};

// removeLastContact();

import { readContacts } from "../../utils/contacts/readContacts.js";
import { writeContacts } from "../../utils/contacts/writeContacts.js";

const removeLastContact = async()=> {
    const contactList = await readContacts();
    contactList.pop();
    await writeContacts(contactList);
};

removeLastContact();