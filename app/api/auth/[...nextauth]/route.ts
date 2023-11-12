import NextAuth from "next-auth";
import type { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcrypt";
import clientPromise from "@/lib/mongodb";

const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      profile: async (profile) => {
        try {
          const client = await clientPromise;
          const db = client.db("TikTokAgencyScraper");
          const usersCollection = db.collection("administrators");
          const foundUser = await usersCollection
            .find({ email: profile.email?.toLowerCase() || "" })
            .toArray();
          if (foundUser[0]) {
            return {
              id: profile.at_hash,
              name: profile.name,
              email: profile.email,
              image: profile.picture,
            };
          }
          return { id: foundUser[0] };
        } catch (e) {
          console.error(e);
          return { id: "" };
        }
      },
    }),
    CredentialsProvider({
      type: "credentials",
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "text",
          placeholder: "example@email.com",
        },
        password: { label: "Password", type: "password", placeholder: "***" },
      },
      async authorize(credentials, req) {
        if (typeof credentials !== "undefined") {
          const { email, password } = credentials;
          try {
            const client = await clientPromise;
            const db = client.db("TikTokAgencyScraper");
            const usersCollection = db.collection("administrators");
            const foundUser = await usersCollection
              .find({ email: email?.toLowerCase() || "" })
              .toArray();
            if (foundUser[0]) {
              const isPasswordCorrect = await bcrypt.compare(
                password,
                foundUser[0].password
              );
              if (isPasswordCorrect) {
                const { _id, email, temporaryPassword } = foundUser[0];
                return {
                  id: _id?.toString() || "",
                  email: email?.toString() || "",
                  temporaryPassword: !!temporaryPassword,
                };
              } else {
                return null;
              }
            } else {
              return null;
            }
          } catch (e) {
            console.error(e);
          }
          return null;
        } else {
          return null;
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
  callbacks: {
    jwt: async ({ user, token, session }) => {
      if (user) token.user = user;
      if (session) {
        let tokenUser = token.user as { [key: string]: any };
        tokenUser = {
          ...user,
          id: user?.id || session.user._id,
          ...(session.user || {}),
        };
        if (tokenUser._id) delete tokenUser._id;
        token.user = tokenUser;
      }
      return token;
    },
    session: async ({ session, token }) => {
      session.user = token.user as {
        id: string;
        email: string;
        temporaryPassword: boolean;
      };
      return session;
    },
  },
  pages: {
    signIn: "/admin",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
