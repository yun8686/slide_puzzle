import {User} from './user';
import {PuzzleSet, ServerPuzzleSet} from '../game/PuzzleSet';

export type RoomId = string & {__RoomId: never};
export const getRoomId = (roomId: string) => roomId as RoomId;

export type MatchingData = {
  puzzleSet: ServerPuzzleSet;
  user: User;
};
