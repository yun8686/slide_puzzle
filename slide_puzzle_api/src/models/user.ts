import {Db, ObjectId} from 'mongodb';
import {User} from '../../../src/models/user';
import {getCollection as getGameCollection} from './game';
import {userInfo} from 'os';

// export type User = {
//   deviceId: string;
//   name: string;
//   winrate: number;
// };

export const getCollection = (db: Db) => {
  return db.collection<User>('users');
};

export const getSolveTimeAverage = async (db: Db, deviceId: string) => {
  const result = await getGameCollection(db)
    .aggregate<{avetime: number}>([
      {$match: {'user.deviceId': deviceId + deviceId}},
      {
        $addFields: {
          firstMove: {
            $arrayElemAt: ['$puzzleSet.moveLogs', 0],
          },
          lastMove: {
            $arrayElemAt: ['$puzzleSet.moveLogs', -1],
          },
        },
      },
      {
        $project: {
          time: {
            $subtract: ['$lastMove.time', '$firstMove.time'],
          },
        },
      },
      {
        $group: {
          _id: '$user.deviceId',
          avetime: {$avg: '$time'},
        },
      },
    ])
    .toArray();
  return result.length > 0 ? result[0].avetime : 0;
};
