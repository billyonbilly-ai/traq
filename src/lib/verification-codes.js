import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

export async function createVerificationCode(email, code) {
  await client.connect();
  const db = client.db();
  await db.collection("verification_codes").insertOne({
    email,
    code,
    expires: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes expiry
  });
}

export async function getVerificationCode(email, code) {
  await client.connect();
  const db = client.db();
  return db.collection("verification_codes").findOne({
    email,
    code,
    expires: { $gt: new Date() },
  });
}

export async function deleteVerificationCode(email, code) {
  await client.connect();
  const db = client.db();
  await db.collection("verification_codes").deleteOne({ email, code });
} 