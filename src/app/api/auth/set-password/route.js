import { NextResponse } from "next/server";
import { getUserByEmail, updateUser } from "@/lib/user-utils";
import { hash } from "bcryptjs";
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

export async function POST(req) {
  const { email, name, password } = await req.json();
  const hashedPassword = await hash(password, 10);

  await client.connect();
  const db = client.db();
  let user = await db.collection("users").findOne({ email });

  if (user) {
    await updateUser(user._id, { name, password: hashedPassword });
  } else {
    await db.collection("users").insertOne({ email, name, password: hashedPassword });
  }

  return NextResponse.json({ success: true });
} 