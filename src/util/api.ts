import {User, getMe, updateMe} from '../models/user';
import {getUniqueId} from 'react-native-device-info';
import RNLocalize from 'react-native-localize';
import {PuzzleSet, ServerPuzzleSet} from '../game/PuzzleSet';
import {Panel, GameMode} from '../game';
import {ImageInfo, ImageId} from '../../slide_puzzle_api/src/models/image';

// const API_HOST = 'http://localhost:8080';
//const API_HOST = 'http://192.168.0.25:8080';
const API_HOST = 'https://slidepuzzle.work';

const sleep = async (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

export const ImageUrl = `${API_HOST}/image/puzzle`;
export const getImageUrl = (imageInfo?: ImageInfo | ImageId) => {
  if (imageInfo) {
    return `${API_HOST}/view/image/${
      typeof imageInfo !== 'string' && '_id' in imageInfo
        ? imageInfo._id
        : imageInfo
    }`;
  } else {
    return `${API_HOST}/view/image/panel`;
  }
};
export const getRanking = async (): Promise<User[]> => {
  const deviceId = getUniqueId();
  return await (
    await fetch(`${API_HOST}/ranking?deviceId=${deviceId}`, {
      method: 'GET',
    })
  ).json();
};

export const getMeFetch = async (): Promise<User> => {
  const deviceId = getUniqueId();
  const region = RNLocalize.getCountry();
  const me = await (
    await fetch(`${API_HOST}/user?deviceId=${deviceId}&region=${region}`, {
      method: 'GET',
    })
  ).json();
  updateMe(me);
  return me;
};

export const updateMeFetch = async (user: Partial<User>): Promise<User> => {
  const deviceId = getUniqueId();
  const result = await (
    await fetch(`${API_HOST}/user`, {
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
  param:
    | {
        isCpu: true;
        imageId: ImageId;
      }
    | {isCpu: false; imageId: ImageId},
): Promise<FindOtherUser> => {
  console.log('getFindOtherUser', param);
  const me = getMe();
  if (param.isCpu) {
    return await createCPUPuzzleSet('computer', param.imageId);
  }
  const fetchResult = await fetch(
    `${API_HOST}/gameResult?deviceId=${me.deviceId}&imageId=${
      param.imageId ?? ''
    }`,
    {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    },
  );
  const result = (await fetchResult.json()) as FindOtherUser | {user: null};
  if (result.user === null) {
    return await createCPUPuzzleSet('computer', param.imageId);
  }
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
    await fetch(`${API_HOST}/gameResult`, {
      method: 'POST',
      body: JSON.stringify({
        user: me,
        gameMode,
        puzzleSet: puzzleSet.getServerPuzzleSet(),
      }),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
  ).json();
  await getMeFetch();
  return result;
};

type GetImageId = {
  imageId: ImageId;
};

const getImageId = async () => {
  const result = (await (
    await fetch(`${API_HOST}/image/defaultImageId`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
  ).json()) as GetImageId;
  console.log('result', result);
  return result;
};

const createCPUPuzzleSet = async (
  cpuName: string,
  imageId: ImageId,
): Promise<FindOtherUser> => {
  imageId = imageId ? imageId : (await getImageId()).imageId;
  console.log('imageId', imageId);
  const results = new PuzzleSet({
    type: 'GenerateConstructor',
    size: 4,
    suffleTimes: 1000,
    imageId,
  });
  const makeObj: FindOtherUser = {
    user: {
      deviceId: 'cpu',
      name: cpuName,
      winrate: 0,
      region: getMe().region,
    },
    puzzleSet: {
      type: 'ServerPuzzleSet',
      imageId,
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

export const getGallary = async (): Promise<ImageInfo[]> => {
  const result = await fetch(`${API_HOST}/image/gallary`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });
  return (await result.json()).imageInfo;
};
