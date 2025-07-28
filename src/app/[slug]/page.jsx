import { redirect, notFound } from 'next/navigation';
import clientPromise from '@/lib/mongodb';

export default async function RedirectSlugPage({ params }) {
    const { slug } = await params;
  const client = await clientPromise;
  const db = client.db();
    let doc = await db.collection('links').findOne({ slug });
    if (!doc) {
      // fallback for legacy records without slug field
      doc = await db.collection('links').findOne({ customLink: { $regex: `${slug}$` } });
    }

    if (!doc) {
      notFound();
    }

    // Increase click count if you want analytics (optional)
    // await db.collection('links').updateOne({ _id: doc._id }, { $inc: { clicks: 1 } });

    redirect(doc.redirectUrl);

}
