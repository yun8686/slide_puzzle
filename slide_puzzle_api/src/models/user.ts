import { Db } from "mongodb";

export type User = {
  deviceId: string;
  name: string;
  winrate: number;
};

export const getCollection = (db: Db) => {
  return db.collection<User>("users");
};
