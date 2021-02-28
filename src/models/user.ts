import RNLocalize from 'react-native-localize';
import DeviceInfo from 'react-native-device-info';

const country = RNLocalize.getCountry();
export type User = {
  deviceId: string;
  name: string;
  winrate: number;
  region: string;
};
let me: User = {
  deviceId: '',
  name: 'Pikachu',
  winrate: 30.01,
  region: country,
};

export const getMe = (): User => {
  return me;
};
export const updateMe = (params: Partial<User>) => {
  me = {
    ...me,
    ...params,
  };
};
