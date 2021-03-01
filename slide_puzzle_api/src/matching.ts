import {User} from './models/user';

const pool: any[] = [];

export const addUserToPool = ({id, user}: {id: string; user: User}) => {
  pool.push({id, user});
};

let matchedEmitter: any;
export const setMatchedEmitter = (me: (ids: string[]) => void) => {
  matchedEmitter = me;
};
const interval = setInterval(() => {
  if (pool.length > 1) {
    if (matchedEmitter) {
      const ids = pool.splice(0, 2);
      matchedEmitter([pool[0], pool[1]]);
    }
  }
}, 1000);
