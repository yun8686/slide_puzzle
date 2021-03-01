export const sendWinPuzzleSet = () => {};

import {Router} from 'express';
import {mongo} from '../mongo';
import {User} from '../models/user';
import {ServerPuzzleSet, getCollection, GameResults} from '../models/game';
const router = Router();

router.get<unknown, GameResults, null, {ignoreDeviceId: string}>(
  '/gameResult',
  async (req, res) => {
    const {ignoreDeviceId} = req.query;
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

router.post<unknown, unknown, {user: User; puzzleSet: ServerPuzzleSet}>(
  '/gameResult',
  async (req, res) => {
    const {user, puzzleSet} = req.body;
    const db = await mongo();
    const gameCollection = getCollection(db);
    const result = await gameCollection.insertOne({
      puzzleSet: puzzleSet,
      user: user,
    });
    res.send(result.ops[0]);
  },
);
export default router;
