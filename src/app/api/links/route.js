'use server';
import clientPromise from '../../../lib/mongodb';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';

export async function GET(req) {
  console.log('GET /api/links');
  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }
  try {
    const client = await clientPromise;
    const db = client.db();
        const filter = { userEmail: session.user.email };
    console.log('filter', filter);
    const links = await db.collection('links').find(filter).toArray();
    console.log('links found', links.length);
    return new Response(JSON.stringify(links), { status: 200 });
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 });
  }
}

export async function POST(req) {
  console.log('POST /api/links');
  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }
  try {
    const data = await req.json();
    const { customLink, redirectUrl } = data;
    if (!customLink || !redirectUrl) {
      return new Response(JSON.stringify({ error: 'Invalid payload' }), { status: 400 });
    }
    const client = await clientPromise;
    const db = client.db();
    const newDoc = {
      userEmail: session.user.email,
      customLink,
      redirectUrl,
      createdAt: new Date()
    };
        const result = await db.collection('links').insertOne(newDoc);
    console.log('inserted id', result.insertedId);
    return new Response(JSON.stringify({ ...newDoc, _id: result.insertedId }), { status: 201 });
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 });
  }
}
