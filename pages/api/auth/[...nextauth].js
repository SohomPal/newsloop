import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import DiscordProvider from "next-auth/providers/discord";
import { MongoClient } from "mongodb"; // MongoDB client

// MongoDB connection
const mongoClient = new MongoClient(process.env.MONGO_URI);

// Creates user if it doesn't exist. If user exists, it returns false. If a new user is succesfully created it returns true
async function createUserIfNotExists(user) {
  try {
    await mongoClient.connect();
    const db = mongoClient.db(process.env.DB_NAME);
    const usersCollection = db.collection("Users");

    // Check if user exists
    const existingUser = await usersCollection.findOne({ email: user.email });
    if (existingUser) {
      return false
    }
    else{
      // Insert new user
      const newUser = {
        name: user.name,
        email: user.email,
        image: user.image,
        createdAt: new Date(),
        preferences: [],
        interactionHistory: []
      };
      await usersCollection.insertOne(newUser);
      return true
    }
  } catch (error) {
    console.error("Error creating user in MongoDB:", error);
    return false; // Default to not a new user on error
  } finally {
    await mongoClient.close();    
  }
}

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
    }),
  ],

  callbacks: {
    async signIn({ user }) {
      // Create user in database if not exists
      const isNewUser = await createUserIfNotExists(user);
      user.isNewUser = isNewUser; // Pass the flag to the JWT
      return true;
    },
    async session({ session, token }) {
      // Attach additional data to the session
      session.user.id = token.id;
      session.user.email = token.email;
      session.user.isNewUser = token.isNewUser;
      return session;
    },
    async jwt({ token, user }) {
      // Pass user data into the JWT token
      if (user) {
        token.id = user.id || token.id;
        token.email = user.email || token.email;
        token.isNewUser = user.isNewUser; // Store isNewUser flag in the token
      }
      user.isNewUser = false
      return token;
    },
    async redirect({ baseUrl }) {
      return baseUrl;
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
    // secret: process.env.NEXTAUTH_JWT_SECRET,
    encryption: false
  },
  
};

export default NextAuth(authOptions);