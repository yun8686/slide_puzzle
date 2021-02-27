import {User} from '../models/user';
import {RoomId, getRoomId} from '../models/room';
type FindOtherUser = {
  otherUser: User;
  roomId: RoomId;
};
export const getFindOtherUser = async (): Promise<FindOtherUser> => {
  return new Promise<FindOtherUser>((resolve) => {
    setTimeout(() => {
      resolve({
        otherUser: {name: 'Raichu', winrate: 10, region: 'US'},
        roomId: getRoomId('roomID'),
      });
    }, 1000);
  });
};
