import {Db, ObjectId, ObjectID} from 'mongodb';

export type ImageId = ObjectId & {_ImageId?: never};
export const ImageId = (imageId: string): ImageId => {
  return new ObjectID(imageId) as ImageId;
};
export type ImageInfo = {
  _id?: ImageId;
  title: string;
  url: string;
};
export const getCollection = (db: Db) => {
  return db.collection<ImageInfo>('imageInfos');
};
