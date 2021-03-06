import {Router} from 'express';
import {mongo} from '../mongo';
import {getCollection} from '../models/user';
import {User} from '../../../src/models/user';
const router = Router();
type RankingQuery = {deviceId: string};
router.get<unknown, User[], unknown, RankingQuery>(
  '/ranking',
  async (req, res) => {
    const {deviceId} = req.query;
    const db = await mongo();
    const userCollection = getCollection(db);
    const user = await userCollection
      .find({})
      .sort({winrate: -1})
      .limit(100)
      .toArray();
    res.json(user);
  },
);
export default router;
