import {User} from '../models/user';
import {RoomId, getRoomId} from '../models/room';
import {getDeviceId, getUniqueId} from 'react-native-device-info';
import RNLocalize from 'react-native-localize';

export const getMeFetch = async (): Promise<User> => {
  const deviceId = getUniqueId();
  const region = RNLocalize.getCountry();
  return await (
    await fetch(
      `http://localhost:8080/user?deviceId=${deviceId}&region=${region}`,
      {method: 'GET'},
    )
  ).json();
};

export const updateMeFetch = async (user: Partial<User>): Promise<User> => {
  const deviceId = getUniqueId();
  const result = await (
    await fetch(`http://localhost:8080/user`, {
      method: 'POST',
      body: JSON.stringify({user, deviceId}),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
  ).json();
  console.log('result', result);
  return result;
};

type FindOtherUser = {
  otherUser: User;
  roomId: RoomId;
};
export const getFindOtherUser = async (): Promise<FindOtherUser> => {
  return new Promise<FindOtherUser>((resolve) => {
    setTimeout(() => {
      resolve({
        otherUser: {deviceId: 'asd', name: 'Raichu', winrate: 10, region: 'US'},
        roomId: getRoomId('roomID'),
      });
    }, 1000);
  });
};
