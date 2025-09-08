<<<<<<< HEAD
<<<<<<< HEAD
import { MongoClient, ServerApiVersion }  from 'mongodb';
const uri = process.env.MONGODB_URI;
=======
import { MongoClient, ServerApiVersion } from 'mongodb';
>>>>>>> 5358e810e02d460f3077cdab9618d35e9c3cddd1
=======

import { MongoClient, ServerApiVersion }  from 'mongodb';
const uri = process.env.MONGODB_URI;

>>>>>>> 44e2e1644d7ac8c27a83cbc507d110d1ccec6930

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
