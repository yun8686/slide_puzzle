import { Router } from "express";
import { mongo } from "../mongo";
import { getCollection, User } from "../models/user";
const router = Router();
type GetUserQuery = {
  deviceId: string;
  region: string;
};
router.get<unknown, unknown, unknown, GetUserQuery>(
  "/user",
  async (req, res) => {
    const { deviceId, region } = req.query;
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
        name: "Peko",
        winrate: 0,
      });
      res.json(user.ops[0]);
    }
  }
);
router.post<unknown, unknown, { user: User; deviceId: string }>(
  "/user",
  async (req, res) => {
    const { deviceId, user } = req.body;
    const db = await mongo();
    const userCollection = getCollection(db);
    const result = await userCollection.updateOne(
      {
        deviceId: deviceId as string,
      },
      {
        $set: {
          name: user.name,
        },
      },
      { upsert: true }
    );
    const updatedUser = await userCollection.findOne({
      deviceId,
    });
    console.log("updatedUser", updatedUser);
    res.send(updatedUser);
  }
);
export default router;
