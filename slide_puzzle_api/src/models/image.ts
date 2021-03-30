import {Db, ObjectId} from 'mongodb';

export type ImageInfo = {
  _id?: ObjectId;
  title: string;
  url: string;
};
export const getCollection = (db: Db) => {
  return db.collection<ImageInfo>('imageInfos');
};
