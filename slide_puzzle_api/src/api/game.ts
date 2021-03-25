export const sendWinPuzzleSet = () => {};

import {Router} from 'express';
import {mongo} from '../mongo';
import {getCollection, GameResults} from '../models/game';
import {
  getCollection as getUserCollection,
  getSolveTimeAverage,
} from '../models/user';
import {GameMode} from '../../../src/game';
import {User} from '../../../src/models/user';
import {ServerPuzzleSet} from '../../../src/game/PuzzleSet';
const router = Router();

router.get<unknown, GameResults, null, {deviceId: string; _id?: string}>(
  '/gameResult',
  async (req, res) => {
    const {deviceId, _id} = req.query;
    const db = await mongo();
    const gameCollection = getCollection(db);
    const resolveTime = await getSolveTimeAverage(db, deviceId);
    const result = await gameCollection
      .aggregate([
        {
          $sample: {size: 10},
        },
      ])
      .toArray();
    const nearResult = result.reduce((prev, curr) => {
      const prevTimeDiff = Math.abs(getGameTime(prev) - resolveTime);
      const currTImeDiff = Math.abs(getGameTime(curr) - resolveTime);
      if (prevTimeDiff > currTImeDiff) {
        return curr;
      } else {
        return prev;
      }
    }, result[0] as GameResults);
    res.send(nearResult);
  },
);

const getGameTime = (gameResult: GameResults) => {
  const moveLogs = gameResult.puzzleSet.moveLogs;
  const lastIndex = moveLogs.length - 1;
  return moveLogs[lastIndex].time - moveLogs[0].time;
};

router.post<
  unknown,
  unknown,
  {gameMode: GameMode; user: User; puzzleSet: ServerPuzzleSet}
>('/gameResult', async (req, res) => {
  const {user, puzzleSet, gameMode} = req.body;
  const db = await mongo();
  const gameCollection = getCollection(db);
  const result = await gameCollection.insertOne({
    puzzleSet: puzzleSet,
    user: user,
  });
  if (gameMode === 'PLAYER') {
    const userCollection = await getUserCollection(db);
    await userCollection.updateOne(
      {deviceId: user.deviceId},
      {$inc: {winrate: 1}},
    );
  }
  res.send(result.ops[0]);
});
export default router;
