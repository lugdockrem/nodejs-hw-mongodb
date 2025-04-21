import ContactCollection from '../db/models/Contact.js';
import { sortList } from '../constants/index.js';
import { calcPaginationData } from '../utils/calcPaginationData.js';

// Отримання списку контактів із фільтрами, пагінацією та сортуванням
export const getContacts = async ({
  page = 1,
  perPage = 10,
  sortBy = '_id',
  sortOrder = sortList[0],
  filters = {},
}) => {
  const skip = (page - 1) * perPage;
  const contactQuery = ContactCollection.find();

  if (filters.userId) {
    contactQuery.where("userId").equals(filters.userId);
  }

  if (filters.contactType) {
    contactQuery.where("contactType").equals(filters.contactType);
  }
  //Фільтр по isFavourite
  if (typeof filters.isFavourite === "boolean") {
    contactQuery.where("isFavourite").equals(filters.isFavourite);
  }

  const totalItems = await ContactCollection.find().merge(contactQuery).countDocuments();

  const data = await contactQuery
    .skip(skip)
    .limit(perPage)
    .sort({ [sortBy]: sortOrder });

  const paginationData = calcPaginationData({ page, perPage, totalItems });

  return {
    data,
    totalItems,
    ...paginationData,
  };
};

// Отримання контакту за id і userId
export const getContactsById = (id, userId) =>
  ContactCollection.findOne({ _id: id, userId });

// Додавання нового контакту
export const addContact = (payload) => ContactCollection.create(payload);

// Оновлення контакту за id і userId
export const updateContact = async (_id, userId, payload, options = {}) => {
  const { upsert = false } = options;
  const rawResult = await ContactCollection.findOneAndUpdate(
    { _id, userId },
    payload,
    {
      upsert,
      includeResultMetadata: true,
    }
  );

  if (!rawResult || !rawResult.value) return null;

  return {
    data: rawResult.value,
    isNew: Boolean(rawResult.lastErrorObject.upserted),
  };
};

// Видалення контакту за id і userId
export const deleteContactById = (_id, userId) =>
  ContactCollection.findOneAndDelete({ _id, userId });