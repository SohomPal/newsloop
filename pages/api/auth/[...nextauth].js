import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import AppleProvider from "next-auth/providers/apple";
import { MongoClient } from "mongodb"; // MongoDB client

// MongoDB connection
const mongoClient = new MongoClient(process.env.MONGO_URI);

async function createUserIfNotExists(user) {
  try {
    await mongoClient.connect();
    const db = mongoClient.db(process.env.DB_NAME);
    const usersCollection = db.collection("Users");

    // Check if user exists
    const existingUser = await usersCollection.findOne({ email: user.email });
    if (!existingUser) {
      // Insert new user
      const newUser = {
        name: user.name,
        email: user.email,
        image: user.image,
        createdAt: new Date(),
      };
      await usersCollection.insertOne(newUser);
    }
  } catch (error) {
    console.error("Error creating user in MongoDB:", error);
  } finally {
    await mongoClient.close();
  }
}

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    AppleProvider({
      clientId: process.env.APPLE_ID,
      clientSecret: process.env.APPLE_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
  ],

  callbacks: {
    async signIn({ user }) {
      // Create user in database if not exists
      await createUserIfNotExists(user);
      return true;
    },
    async session({ session, token }) {
      // Attach additional data to the session
      session.user.id = token.id;
      session.user.email = token.email;
      return session;
    },
    async jwt({ token, user }) {
      // Pass user data into the JWT token
      if (user) {
        token.id = user.id || token.id;
        token.email = user.email || token.email;
      }
      return token;
    },
  },

  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
    newUser: null,
  },

  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  jwt: {
    secret: process.env.NEXTAUTH_JWT_SECRET,
  },
};

export default NextAuth(authOptions);
