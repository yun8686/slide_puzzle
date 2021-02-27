import RNLocalize from 'react-native-localize';
const country = RNLocalize.getCountry();
export type User = {
  name: string;
  winrate: number;
  region: string;
};
const me: User = {
  name: 'Pikachu',
  winrate: 30.01,
  region: country,
};

export const getMe = (): User => me;
