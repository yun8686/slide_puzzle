import {Router} from 'express';
import fs from 'fs';
const router = Router();
router.get<unknown, Buffer, null, {ignoreDeviceId: string}>(
  '/image/puzzle',
  (req, res) => {
    const buf = fs.readFileSync('image/panel.png');
    res.send(buf);
  },
);
export default router;
