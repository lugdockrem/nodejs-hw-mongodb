import createHttpError from 'http-errors';

import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { parseContactFilterParams } from '../utils/filters/parseContactFilterParams.js';

import { contactSortFields } from '../db/models/Contact.js';

import { getContacts, getContactsById, addContact, updateContact, deleteContactById } from '../services/contacts.js';

export const getContactsController = async (req, res, next) => {
  const paginationParams = parsePaginationParams(req.query);
  const sortParams = parseSortParams(req.query, contactSortFields);
  const filters = parseContactFilterParams(req.query);
  const data = await getContacts({...paginationParams, ...sortParams, filters});

  res.json({
    status: 200,
    message: 'Successfully find contacts',
    data: {
      ...data,                     // ← сюда вставляются все данные, которые вернул getContacts
      page: paginationParams.page, // ← сюда значение из параметров пагинации
      perPage: paginationParams.perPage, // ← и сюда
    },
  });
  };

export const getContactsByIdController = async (req, res) => {
  const { id } = req.params;

  const data = await getContactsById(id);

  if (!data) {
    throw createHttpError(404, `Contact with id=${id} not found`);
  }
  
  res.json({
    status: 200,
    message: `Successfully found contact with id=${id}`,
    data,
  });
};

export const addContactController = async(req, res)=> {
  const data = await addContact(req.body);

  res.status(201).json({
    status: 201,
    message: "Successfully add contact",
    data,
  });
};

export const upsertContactController = async(req, res)=> {
  
const {id} = req.params;
const {data, isNew} = await updateContact(id, req.body, {upsert: true});

const status = isNew ? 201 : 200;

res.status(status).json({
  status,
  message: "Successfully update contact",
  data,
});
};

export const patchContactController = async(req, res)=> {
const {id} = req.params;
const result = await updateContact(id, req.body);

if (!result) {
  throw createHttpError(404, `Contact with id=${id} not found`);
}

res.json({
  status:200,
  message:"Successfully update contact",
  data: result.data,
});
};

export const deleteContactController = async(req, res)=> {
  const {id} = req.params;
  const data = await deleteContactById(id);

  if (!data) {
    throw createHttpError(404, `Contact with id=${id} not found`);
  }

  res.status(204).send();
};