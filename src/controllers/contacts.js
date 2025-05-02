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
  filters.userId = req.user._id;

  const data = await getContacts({ ...paginationParams, ...sortParams, filters });

  res.json({
    status: 200,
    message: 'Successfully find contacts',
    data: {
      ...data,
      page: paginationParams.page,
      perPage: paginationParams.perPage,
    },
  });
};

export const getContactsByIdController = async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  const data = await getContactsById(id, userId);

  if (!data) {
    throw createHttpError(404, `Contact with id=${id} not found`);
  }

  res.json({
    status: 200,
    message: `Successfully found contact with id=${id}`,
    data,
  });
};

export const addContactController = async (req, res) => {
  const { _id: userId } = req.user;
  const filePath = req.file ? req.file.path : null;
  const data = await addContact({ ...req.body, userId }, filePath);
  
  res.status(201).json({
    status: 201,
    message: 'Successfully add contact',
    data,
  });
};

export const upsertContactController = async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;
  const filePath = req.file ? req.file.path : null;
  
  const { data, isNew } = await updateContact(id, req.body, { upsert: true, userId }, filePath);
  const status = isNew ? 201 : 200;
  
  res.status(status).json({
    status,
    message: 'Successfully update contact',
    data,
  });
};

export const patchContactController = async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;
  const filePath = req.file ? req.file.path : null;
  
  const result = await updateContact(id, req.body, { userId }, filePath);
  if (!result) {
    throw createHttpError(404, `Contact with id=${id} not found`);
  }
  
  res.json({
    status: 200,
    message: 'Successfully update contact',
    data: result.data,
  });
};

export const deleteContactController = async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  const data = await deleteContactById(id, userId);

  if (!data) {
    throw createHttpError(404, `Contact with id=${id} not found`);
  }

  res.status(204).send();
};
