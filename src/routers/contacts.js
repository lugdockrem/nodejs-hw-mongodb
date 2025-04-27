import { Router } from 'express';
import { upload } from '../middlewares/upload.js';

import { ctrlWrapper } from '../utils/ctrlWrapper.js';

import {
  getContactsController,
  getContactsByIdController,
  addContactController,
  upsertContactController,
  patchContactController,
  // updateContactController,
  deleteContactController,
} from '../controllers/contacts.js';

import { isValidId } from '../middlewares/isValidId.js';
import { authenticate } from '../middlewares/authenticate.js';

import { validateBody } from '../utils/validateBody.js';

import { contactAddSchema, contactUpdateSchema } from '../validation/contacts.js';

const contactsRouter = Router();

contactsRouter.use(authenticate);

contactsRouter.get('/', ctrlWrapper(getContactsController));

contactsRouter.get('/:id',  isValidId, ctrlWrapper(getContactsByIdController));

contactsRouter.post('/', upload.single('photo'), validateBody(contactAddSchema), ctrlWrapper(addContactController));

contactsRouter.put('/:id', isValidId, upload.single('photo'), validateBody(contactAddSchema), ctrlWrapper(upsertContactController));

contactsRouter.patch('/:id', isValidId, upload.single('photo'), validateBody(contactUpdateSchema), ctrlWrapper(patchContactController));

contactsRouter.delete('/:id', isValidId, ctrlWrapper(deleteContactController));

export default contactsRouter;
