import { MongoClient, type Db } from "mongodb";

declare global {
  var __mongoClientPromise: Promise<MongoClient> | undefined;
}

function getMongoUri() {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error("Missing MONGODB_URI environment variable.");
  }

  return mongoUri;
}

async function getClientPromise() {
  if (process.env.NODE_ENV === "development") {
    if (!global.__mongoClientPromise) {
      const client = new MongoClient(getMongoUri());
      global.__mongoClientPromise = client.connect();
    }

    return global.__mongoClientPromise;
  }

  const client = new MongoClient(getMongoUri());
  return client.connect();
}

export async function getMongoDb(): Promise<Db> {
  const connectedClient = await getClientPromise();
  return connectedClient.db();
}
