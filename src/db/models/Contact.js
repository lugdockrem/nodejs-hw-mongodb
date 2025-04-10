import { Schema, model } from 'mongoose';

import { typeList, minBirthYear } from '../../constants/contacts.js';

import { handlSaveError, setUpdateSettings } from './hooks.js';

const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Прізвище обов'язкове!"],
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    isFavourite: {
      type: Boolean,
      default: false,
      required: true,
    },
    contactType: {
      type: String,
      enum: typeList,
      default: typeList[0],
      required: true,
    },
    birthYear: {
      type: Number,
      min: minBirthYear,
      required: true,
    },
  },
  { versionKey: false, timestamps: true },
);

contactSchema.post('save', handlSaveError);

contactSchema.pre('findOneAndUpdate', setUpdateSettings);

contactSchema.post('findOneAndUpdate', handlSaveError);

export const contactSortFields = [
  'name',
  'email',
  'isFavourite',
  'contactType',
  'birthYear',
];

const ContactCollection = model('contact', contactSchema);

export default ContactCollection;
