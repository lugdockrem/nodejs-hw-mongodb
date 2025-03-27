// export const removeAllContacts = async () => {};

// removeAllContacts();

import { writeContacts } from "../../utils/contacts/writeContacts.js";

const removeAllContacts = ()=> writeContacts([]);

removeAllContacts();
