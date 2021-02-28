import {MongoClient, Db} from 'mongodb';

let db: Db;
const mongoURL = 'mongodb://localhost:27017';
export async function initMongo() {
  const client = await MongoClient.connect(mongoURL, {
    useUnifiedTopology: true,
  });
  if (db) return;
  try {
    db = client.db(process.env.DB_NAME || 'slide_puzzle');
    if (process.env.NODE_ENV === 'test') {
      return;
    }
    console.log('mongo connected');
  } catch (err) {
    console.error('mongo error', err);
  }
}
export async function mongo() {
  await initMongo();
  return db;
}
