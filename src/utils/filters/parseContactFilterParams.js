import { typeList } from "../../constants/contacts.js";

const parseNumber = value => {
    if(typeof value !== "string") return;

    const parseNumber = parseInt(value);
    if(Number.isNaN(parseNumber)) return;

    return parseNumber;
};

export const parseContactFilterParams = (contactType, isFavourite)=> {
    
    const parsedcontactType = typeList.includes(contactType) ? contactType : undefined;
    const parsedIsFavourite = 
    isFavourite === "true" ? true :
    isFavourite === "false" ? false :
    undefined;

    return {
        contactType: parsedcontactType,
        isFavourite: parsedIsFavourite
    };
};