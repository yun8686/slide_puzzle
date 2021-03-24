export const sendWinPuzzleSet = () => {};

import {Router} from 'express';
import {mongo} from '../mongo';
import {getCollection, GameResults} from '../models/game';
import {getCollection as getUserCollection} from '../models/user';
import {GameMode} from '../../../src/game';
import {User} from '../../../src/models/user';
import {ServerPuzzleSet} from '../../../src/game/PuzzleSet';
const router = Router();

router.get<unknown, GameResults, null, {ignoreDeviceId: string; _id?: string}>(
  '/gameResult',
  async (req, res) => {
    const {ignoreDeviceId, _id} = req.query;
    const db = await mongo();
    const gameCollection = getCollection(db);
    const result = await gameCollection
      .aggregate([
        {
          $sample: {size: 1},
        },
      ])
      .toArray();
    res.send(result[0]);
  },
);

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
