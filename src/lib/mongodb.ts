import { MongoClient, Db, Collection } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017";
const DB_NAME = process.env.MONGODB_DB || "wedy";

let client: MongoClient | null = null;
let db: Db | null = null;

async function connectClient() {
  if (!client || (client as any).closed) {
    client = new MongoClient(MONGODB_URI);
    await client.connect();
  }
}

export async function getDb(): Promise<Db> {
  if (!client || (client as any).closed) {
    await connectClient();
  }
  if (!db || (client as any).closed) {
    db = client!.db(DB_NAME);
  }
  return db!;
}

export async function getContractsCollection(): Promise<Collection> {
  const database = await getDb();
  return database.collection("contracts");
}
