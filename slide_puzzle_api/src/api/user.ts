import {Router} from 'express';
import {mongo} from '../mongo';
import {getCollection} from '../models/user';
import {User} from '../../../src/models/user';
const router = Router();
type QueryUser = {
  get: {
    deviceId: string;
    region: string;
  };
  post: {user: Partial<User>; deviceId: string};
};
router.get<unknown, User, unknown, QueryUser['get']>(
  '/user',
  async (req, res) => {
    const {deviceId, region} = req.query;
    const db = await mongo();
    const userCollection = getCollection(db);
    const user = await userCollection.findOne({
      deviceId,
    });
    if (user) {
      res.json(user);
    } else {
      const user = await userCollection.insertOne({
        deviceId,
        name: 'no name',
        region,
        winrate: 0,
      });
      const r = user.ops[0];
      res.json(r);
    }
  },
);
router.post<unknown, User, QueryUser['post']>('/user', async (req, res) => {
  const {deviceId, user} = req.body;
  const db = await mongo();
  const userCollection = getCollection(db);
  await userCollection.updateOne(
    {
      deviceId: deviceId,
    },
    {
      $set: {
        name: user.name,
      },
    },
    {upsert: true},
  );
  const updatedUser = await userCollection.findOne({
    deviceId,
  });
  if (updatedUser) res.send(updatedUser);
});

export default router;
