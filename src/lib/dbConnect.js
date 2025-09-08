
import { MongoClient, ServerApiVersion }  from 'mongodb';
const uri = process.env.MONGODB_URI;


const uri = process.env.MONGODB_URI; 

async function dbConnect(collectionName) {
  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });

  await client.connect();
  const db = client.db(process.env.DB_NAME);
  const collection = db.collection(collectionName);

  return { client, collection };
}

export default dbConnect;
