import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import EmailProvider from "next-auth/providers/email";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb";
import { getUserByEmail, linkAccount, updateUser } from "@/lib/user-utils";

const handler = NextAuth({
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    EmailProvider({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
    }),
  ],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async signIn({ user, account }) {
      // 1. Find existing user by email
      const existingUser = await getUserByEmail(user.email);
      if (existingUser) {
        // 2. If account is not already linked, link it
        await linkAccount(existingUser._id, account);
        // 3. Always use the original display name
        user.name = existingUser.name;
        // 4. Optionally, update the user in the database to ensure consistency
        await updateUser(existingUser._id, { name: existingUser.name });
        return true;
      }
      // If no existing user, allow sign in as normal
      return true;
    },
    async session({ session, user }) {
      // Always use the original display name from the DB
      if (user && user.name) session.user.name = user.name;
      return session;
    },
    async redirect({ url, baseUrl }) {
      return '/dashboard';
    },
  },
});

export { handler as GET, handler as POST };