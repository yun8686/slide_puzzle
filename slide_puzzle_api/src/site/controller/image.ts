import {Router} from 'express';
import {getCollection as getImageCollection, ImageId} from '../../models/image';
import {mongo} from '../../mongo';
import fs from 'fs';

import multer from 'multer';
import {ObjectID} from 'mongodb';
const upload = multer({dest: 'uploads/'});

const ROUTE = '/view/image';
const router = Router();
router.get<unknown, Buffer, null, {ignoreDeviceId: string}>(
  ROUTE,
  async (req, res) => {
    const db = await mongo();
    const results = await getImageCollection(db).find({}).toArray();
    res.render('./image.ejs', {imageResults: results});
  },
);
router.post(ROUTE, upload.single('file'), async (req, res) => {
  const db = await mongo();
  const title = req.body.title;
  const imagePath = req.file?.destination + req.file?.filename;
  await getImageCollection(db).insertOne({
    title: title,
    url: imagePath,
  });
  res.redirect(ROUTE);
});
router.get(ROUTE + '/panel', async (req, res) => {
  const db = await mongo();
  const result = await getImageCollection(db).findOne({
    title: 'panel',
  });
  if (result) {
    const buf = fs.readFileSync(result?.url);
    res.send(buf);
  } else {
    res.send();
  }
});
router.get(ROUTE + '/:imageId', async (req, res) => {
  const db = await mongo();
  const result = await getImageCollection(db).findOne({
    _id: ImageId(req.params.imageId),
  });
  if (result) {
    const buf = fs.readFileSync(result?.url);
    res.send(buf);
  } else {
    res.send();
  }
});

export default router;
