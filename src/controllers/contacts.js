import createHttpError from 'http-errors';

import { getContacts, getContactsById, addContact, updateContact } from '../services/contacts.js';

export const getContactsController = async (req, res, next) => {
  const data = await getContacts();

  res.json({
    status: 200,
    message: 'Successfully find contacts',
    data,
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