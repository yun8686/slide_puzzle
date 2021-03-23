import {User, getMe} from '../models/user';
import {getUniqueId} from 'react-native-device-info';
import RNLocalize from 'react-native-localize';
import {PuzzleSet, ServerPuzzleSet} from '../game/PuzzleSet';
import {Panel, GameMode} from '../game';

// const API_HOST = 'localhost:8080';
const API_HOST = '153.126.161.193:8080';

const sleep = async (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

export const ImageUrl = `http://${API_HOST}/image/puzzle`;
export const getRanking = async (): Promise<User[]> => {
  const deviceId = getUniqueId();
  return await (
    await fetch(`http://${API_HOST}/ranking?deviceId=${deviceId}`, {
      method: 'GET',
    })
  ).json();
};

export const getMeFetch = async (): Promise<User> => {
  const deviceId = getUniqueId();
  const region = RNLocalize.getCountry();
  return await (
    await fetch(
      `http://${API_HOST}/user?deviceId=${deviceId}&region=${region}`,
      {method: 'GET'},
    )
  ).json();
};

export const updateMeFetch = async (user: Partial<User>): Promise<User> => {
  const deviceId = getUniqueId();
  const result = await (
    await fetch(`http://${API_HOST}/user`, {
      method: 'POST',
      body: JSON.stringify({user, deviceId}),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
  ).json();
  return result;
};

type FindOtherUser = {
  puzzleSet: ServerPuzzleSet;
  user: User;
};

export const getFindOtherUser = async (
  isCpu?: boolean,
): Promise<FindOtherUser> => {
  const me = getMe();
  if (isCpu) {
    return createCPUPuzzleSet('computer');
  }
  const result = (await (
    await fetch(`http://${API_HOST}/gameResult?ignoreDeviceId=${me.deviceId}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
  ).json()) as FindOtherUser;
  await sleep(2000);
  return {
    ...result,
    puzzleSet: {
      ...result.puzzleSet,
      type: 'ServerPuzzleSet',
    },
  };
};

export const sendPuzzleSet = async (
  gameMode: GameMode,
  puzzleSet: PuzzleSet,
) => {
  const me = getMe();
  const result = await (
    await fetch(`http://${API_HOST}/gameResult`, {
      method: 'POST',
      body: JSON.stringify({
        user: me,
        gameMode,
        puzzleSet: {
          originPanel: puzzleSet.getOriginPanel(),
          moveLogs: puzzleSet.getMoveLogs(),
        },
      }),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
  ).json();
  return result;
};

const createCPUPuzzleSet = (cpuName: string): FindOtherUser => {
  const results = new PuzzleSet(4, 1000);
  const makeObj: FindOtherUser = {
    user: {
      deviceId: 'cpu',
      name: cpuName,
      winrate: 0,
      region: getMe().region,
    },
    puzzleSet: {
      type: 'ServerPuzzleSet',
      originPanel: Array.from(results.getPanel()) as Panel,
      moveLogs: results
        .getRoutes()
        .reverse()
        .map((index, i) => ({
          emptyIndex: index,
          time: i * 1000,
        })),
    },
  };
  return makeObj;
};
