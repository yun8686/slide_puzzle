import { User } from "./user";
import { Db } from "mongodb";

export type RoomId = string & { __RoomId: never };
export type Panel = number[] & { __RoomId: never };
type LogRow = {
  time: number;
  emptyIndex: number;
};
export type ServerPuzzleSet = {
  originPanel: Panel;
  moveLogs: LogRow[];
};
export type GameResults = {
  puzzleSet: ServerPuzzleSet;
  user: User;
};
export const getCollection = (db: Db) => {
  return db.collection<GameResults>("gameResults");
};
