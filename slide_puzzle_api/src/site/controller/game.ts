import * as Express from 'express';
import {
  getCollection as getGameCollection,
  GameResults,
} from '../../models/game';
import {mongo} from '../../mongo';
const gameview = async (
  _req: Express.Request,
  res: Express.Response,
  //   next: Express.NextFunction,
) => {
  const db = await mongo();
  const results = await getGameCollection(db).find({}).toArray();
  res.render('./game.ejs', {gameResults: results});
};
export default gameview;
