import {Db} from 'mongodb';
import {User} from '../../../src/models/user';
import {ServerPuzzleSet} from '../../../src/game/PuzzleSet';

export type GameResults = {
  puzzleSet: ServerPuzzleSet;
  user: User;
};
export const getCollection = (db: Db) => {
  return db.collection<GameResults>('gameResults');
};
