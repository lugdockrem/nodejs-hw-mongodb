import { typeList } from "../../constants/contacts.js";

const parseNumber = value => {
    if(typeof value !== "string") return;

    const parseNumber = parseInt(value);
    if(Number.isNaN(parseNumber)) return;

    return parseNumber;
};

export const parseContactFilterParams = (minBirthYear, maxBirthYear, contactType, isFavourite)=> {
    const parsedMinBirthYear = parseNumber(minBirthYear);
    const parsedMaxBirthYear = parseNumber(maxBirthYear);

    const parsedcontactType = typeList.includes(contactType) ? contactType : undefined;
    const parsedIsFavourite = 
    isFavourite === "true" ? true :
    isFavourite === "false" ? false :
    undefined;

    return {
        minBirthYear: parsedMinBirthYear,
        maxBirthYear: parsedMaxBirthYear,
        contactType: parsedcontactType,
        isFavourite: parsedIsFavourite
    };
};