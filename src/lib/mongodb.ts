import { MongoClient, type Db } from "mongodb";

declare global {
  var __mongoClientPromise: Promise<MongoClient> | undefined;
}

const mongoUri = process.env.MONGODB_URI;

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

function getMongoUri() {
  if (!mongoUri) {
    throw new Error("Missing MONGODB_URI environment variable.");
  }

  return mongoUri;
}

if (process.env.NODE_ENV === "development") {
  if (!global.__mongoClientPromise) {
    client = new MongoClient(getMongoUri());
    global.__mongoClientPromise = client.connect();
  }

  clientPromise = global.__mongoClientPromise;
} else {
  client = new MongoClient(getMongoUri());
  clientPromise = client.connect();
}

export async function getMongoDb(): Promise<Db> {
  const connectedClient = await clientPromise;
  return connectedClient.db();
}
