import {mongo} from '../src/mongo';
import {getCollection} from '../src/models/game';

(async () => {
  const db = await mongo();
  const res = await getCollection(db).find({}).toArray();
  console.log(
    res.map((v) => ({
      name: v.user.name,
    })),
  );
})();
