import * as Express from 'express';
import {
  getCollection as getGameCollection,
  GameResults,
} from '../../models/game';
import {mongo} from '../../mongo';
import {ObjectID} from 'mongodb';
const gameview = async (
  _req: Express.Request,
  res: Express.Response,
  //   next: Express.NextFunction,
) => {
  const db = await mongo();
  const results = await getGameCollection(db)
    .find({})
    .toArray();
  res.render('./game.ejs', {gameResults: results});
};

export const gameviewPost = async (
  req: Express.Request<unknown, unknown, {name: string; _id: string}>,
  res: Express.Response,
  //   next: Express.NextFunction,
) => {
  console.log('req', req.body);
  const {_id, name} = req.body;
  const db = await mongo();
  if (name) {
    const results = await getGameCollection(db).update(
      {_id: new ObjectID(_id)},
      {$set: {'user.name': name}},
    );
  }
  const results = await getGameCollection(db).find({}).toArray();
  res.render('./game.ejs', {gameResults: results});
};

export default gameview;
