import ContactCollection from '../db/models/Contact.js';

import { sortList } from '../constants/index.js';

import { calcPaginationData } from '../utils/calcPaginationData.js';

export const getContacts = async ({
  page = 1,
  perPage = 10,
  sortBy = '_id',
  sortOder = sortList[0],
  filters = {},
}) => {
  const skip = (page - 1) * perPage;
  const contactQuery = ContactCollection.find();
  
  if(filters.contactType) {
    contactQuery.where("contactType").equals(filters.contactType);
  }

  if(typeof filters.isFavourite === "boolean")

  if(filters.minBirthYear) {
    contactQuery.where("BirthYear").gte(filters.minBirthYear);
  }

  if(filters.maxBirthYear) {
    contactQuery.where("BirthYear").lte(filters.maxBirthYear);
  }

  const items = await contactQuery
    .skip(skip)
    .limit(perPage)
    .sort({ [sortBy]: sortOder });
  const totalItems = await ContactCollection.find().merge(contactQuery).countDocuments();

  const paginationData = calcPaginationData({ page, perPage, totalItems });

  return {
    items,
    totalItems,
    ...paginationData,
  };
};

export const getContactsById = (id) => ContactCollection.findOne({ _id: id });

export const addContact = (payload) => ContactCollection.create(payload);

export const updateContact = async (_id, payload, options = {}) => {
  const { upsert = false } = options;
  const rawResult = await ContactCollection.findOneAndUpdate({ _id }, payload, {
    upsert,
    includeResultMetadata: true,
  });

  if (!rawResult || !rawResult.value) return null;

  return {
    data: rawResult.value,
    isNew: Boolean(rawResult.lastErrorObject.upserted),
  };
};

export const deleteContactById = (_id) =>
  ContactCollection.findOneAndDelete({ _id });
