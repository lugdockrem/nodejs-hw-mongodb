import ContactCollection from '../db/models/Contact.js';
import { sortList } from '../constants/index.js';
import { calcPaginationData } from '../utils/calcPaginationData.js';
import { uploadImage } from '../utils/cloudinary.js';
import fs from 'fs/promises';

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
export const addContact = async (userData, filePath = null) => {
  let payload = { ...userData };
  
  if (filePath) {
    const photoUrl = await uploadImage(filePath);
    // Видаляємо тимчасовий файл
    await fs.unlink(filePath).catch(err => console.error('Error deleting file:', err));
    payload.photo = photoUrl;
  }
  
  return ContactCollection.create(payload);
};

// Оновлення контакту за id і userId
export const updateContact = async (_id, payload, options = {}, filePath = null) => {
  const { userId, upsert = false } = options;
  let updateData = { ...payload };
  
  if (filePath) {
    const photoUrl = await uploadImage(filePath);
    // Видаляємо тимчасовий файл
    await fs.unlink(filePath).catch(err => console.error('Error deleting file:', err));
    updateData.photo = photoUrl;
  }
  
  const rawResult = await ContactCollection.findOneAndUpdate(
    { _id, userId },
    updateData,
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