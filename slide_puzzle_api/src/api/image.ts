import {Router} from 'express';
import fs from 'fs';
import {mongo} from '../mongo';
import {getCollection as getImageCollection, ImageInfo} from '../models/image';
const router = Router();
router.get<unknown, Buffer, null, {ignoreDeviceId: string}>(
  '/image/puzzle',
  (req, res) => {
    const buf = fs.readFileSync('image/panel.png');
    res.send(buf);
  },
);

router.get<unknown, {imageInfo: ImageInfo[]}, null, {ignoreDeviceId: string}>(
  '/image/gallary',
  async (req, res) => {
    const db = await mongo();
    const results = await getImageCollection(db).find({}).toArray();
    res.send({imageInfo: results});
  },
);

export default router;
