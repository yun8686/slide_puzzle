import io from 'socket.io-client';
import {C2SEmitTypes, S2CEmitTypes} from './emitTypes';
let socket: SocketIOClient.Socket | null;
const handlers: {[key: string]: Function[]} = {};
const connect = () => {
  if (socket) {
    socket.close();
    socket = null;
  }
  socket = io('http://localhost:8080/game', {transports: ['websocket']});
};
const getSocket = () => {
  if (!socket) {
    connect();
  }
  return socket;
};

function runAllHandlers(key: string, arg: any[]) {
  handlers[key] &&
    handlers[key].forEach((handler, i) => {
      console.log('runAllHandlers', key, i);
      return handler(...arg);
    });
}
function onKey(key: string) {
  socket?.on(key, (...arg: any[]) => {
    runAllHandlers(key, arg);
  });
}

export const addHandler = <T extends S2CEmitTypes>(
  key: T['key'],
  func: (val: T['value']) => void,
) => {
  if (!handlers[key]) {
    handlers[key] = [];
    onKey(key);
  }
  handlers[key].push(func);
  console.log('handler', handlers[key]);
};
export const removeHandler = (key: string) => {
  if (!handlers[key]) return;
  handlers[key] = [];
};
export const sendEmit = ({key, value}: C2SEmitTypes) => {
  if (socket) socket.emit(key, value);
};
export const disconnect = () => {
  socket?.close();
  socket = null;
};

export default getSocket();
