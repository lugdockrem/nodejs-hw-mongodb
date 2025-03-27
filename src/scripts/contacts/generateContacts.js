import { createFakeContact } from "../../utils/contacts/createFakeContact.js";
import { readContacts } from "../../utils/contacts/readContacts.js";
import { writeContacts } from "../../utils/contacts/writeContacts.js";

const generateContacts = async (number) => {
    const contactList = await readContacts();
    const newContacts = Array(number).fill(0).map(createFakeContact);
    await writeContacts([...contactList, ...newContacts]); 
    
};

generateContacts(5);
