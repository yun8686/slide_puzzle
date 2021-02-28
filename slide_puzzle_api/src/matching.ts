import { User } from "./models/user";

const pool = [];

export const addUserToPool = ({ id, user }: { id: string; user: User }) => {
  pool.push({ id, user });
};

let matchedEmitter;
export const setMatchedEmitter = (me: (ids: string[]) => void) => {
  matchedEmitter = me;
};
const interval = setInterval(() => {
  if (pool.length > 1) {
    console.log("pool", pool);
    if (matchedEmitter) {
      const ids = pool.splice(0, 2);
      matchedEmitter([pool[0], pool[1]]);
    }
  }
}, 1000);
