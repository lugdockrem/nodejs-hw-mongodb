import createHttpError from 'http-errors';

import UserCollection from '../db/models/User.js';

export const registerUser = async (payload) => {
  const { email } = payload;
  const user = await UserCollection.find({ email });
  if (user) {
    throw createHttpError(409, 'Email already in use');
  }
  return await UserCollection.create(payload);
};
