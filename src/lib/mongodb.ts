import { MongoClient } from 'mongodb';
const uri = process.env.MONGODB_URI;
if (!uri) throw new Error('MONGODB_URI is not configured.');
const options = { appName: 'LandGuard-AI' };
let client: MongoClient;
let clientPromise: Promise<MongoClient>;
declare global { var _landguardMongoClientPromise: Promise<MongoClient> | undefined; }
if (process.env.NODE_ENV === 'development') {
  if (!global._landguardMongoClientPromise) { client = new MongoClient(uri, options); global._landguardMongoClientPromise = client.connect(); }
  clientPromise = global._landguardMongoClientPromise;
} else { client = new MongoClient(uri, options); clientPromise = client.connect(); }
export async function getDb() { return (await clientPromise).db(process.env.MONGODB_DB || 'landguard'); }
