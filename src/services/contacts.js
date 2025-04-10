import ContactCollection from '../db/models/Contact.js';

import { calcPaginationData } from '../utils/calcPaginationData.js';

export const getContacts = async ({page = 1, perPage = 10}) => {
  const skip = (page -1) * perPage;
  const items = await ContactCollection.find().skip(skip).limit(perPage);
  const totalItems = await ContactCollection.find().countDocuments();

const paginationData = calcPaginationData({page, perPage, totalItems});

  return {
    items,
    totalItems,
    ...paginationData,
  };
};

export const getContactsById = (id) => ContactCollection.findOne({ _id: id });

export const addContact = (payload) => ContactCollection.create(payload);

export const updateContact = async (_id, payload, options = {}) => {
    const {upsert = false} = options;
  const rawResult = await ContactCollection.findOneAndUpdate({ _id }, payload, {
    upsert,
    includeResultMetadata: true,
  });

  if(!rawResult || !rawResult.value) return null;

  return {
    data: rawResult.value,
    isNew: Boolean(rawResult.lastErrorObject.upserted)
  };
};

export const deleteContactById = _id => ContactCollection.findOneAndDelete({_id});