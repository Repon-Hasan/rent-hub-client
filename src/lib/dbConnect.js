import { MongoClient, ServerApiVersion }  from 'mongodb';
const uri = process.env.MONGO_URI;


async function dbConnect(collection) {
    const client = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      }
    });
    await client.connect();
    const db = client.db(process.env.DB_NAME);
    const coll = db.collection(collection);
    return { client, collection: coll };
}

export default dbConnect;

// --- IGNORE ---
// MONGODB_URI="your_mongodb_connection_string" -- from env.local
// DB_NAME="your_database_name" -- from env.local
// collection="your_collection_name"
// --- IGNORE ---