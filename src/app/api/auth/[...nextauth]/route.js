import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import EmailProvider from "next-auth/providers/email";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb";
import { getUserByEmail, linkAccount, updateUser } from "@/lib/user-utils";
import { compare } from "bcryptjs";

const handler = NextAuth({
  adapter: MongoDBAdapter(clientPromise),
  session: {
    strategy: 'jwt',
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    EmailProvider({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const user = await getUserByEmail(credentials.email);
        console.log('CredentialsProvider authorize: user', user);
        if (!user || !user.password) return null;
        const isValid = await compare(credentials.password, user.password);
        console.log('CredentialsProvider authorize: isValid', isValid);
        if (!isValid) return null;
        const result = {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
        };
        console.log('CredentialsProvider authorize: returning', result);
        return result;
      },
    }),
  ],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async signIn({ user, account }) {
      const existingUser = await getUserByEmail(user.email);
      if (existingUser) {
        await linkAccount(existingUser._id, account);
        user.name = existingUser.name;
        await updateUser(existingUser._id, { name: existingUser.name });
        return true;
      }
      return true;
    },
    async session({ session, user }) {
      console.log('Session callback: session', session, 'user', user);
      if (user && user.name) session.user.name = user.name;
      if (user && user.email) session.user.email = user.email;
      if (user && user.id) session.user.id = user.id;
      return session;
    },
  },
});

export { handler as GET, handler as POST };