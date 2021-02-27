import {User} from './user';

export type RoomId = string & {__RoomId: never};
export const getRoomId = (roomId: string) => roomId as RoomId;

export type MatchingData = {
  otherUser: User;
  roomId: RoomId;
};
