import { MongoClient, ObjectId } from "mongodb";

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

export async function getUserByEmail(email) {
  await client.connect();
  const db = client.db();
  return db.collection("users").findOne({ email });
}

export async function linkAccount(userId, account) {
  await client.connect();
  const db = client.db();
  // Check if account is already linked
  const existing = await db.collection("accounts").findOne({
    userId: typeof userId === 'string' ? new ObjectId(userId) : userId,
    provider: account.provider,
    providerAccountId: account.providerAccountId,
  });
  if (!existing) {
    await db.collection("accounts").insertOne({
      userId: typeof userId === 'string' ? new ObjectId(userId) : userId,
      ...account,
    });
  }
}

export async function updateUser(userId, update) {
  await client.connect();
  const db = client.db();
  await db.collection("users").updateOne(
    { _id: typeof userId === 'string' ? new ObjectId(userId) : userId },
    { $set: update }
  );
} 