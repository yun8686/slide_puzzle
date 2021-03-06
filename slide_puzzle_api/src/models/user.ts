import {Db} from 'mongodb';
import {User} from '../../../src/models/user';

// export type User = {
//   deviceId: string;
//   name: string;
//   winrate: number;
// };

export const getCollection = (db: Db) => {
  return db.collection<User>('users');
};
