import {Db} from 'mongodb';

export type ImageInfo = {
  title: string;
  url: string;
};
export const getCollection = (db: Db) => {
  return db.collection<ImageInfo>('imageInfos');
};
