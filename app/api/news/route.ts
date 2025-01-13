import { NextResponse } from "next/server";
import { MongoClient, ObjectId } from "mongodb";
import rankArticles from "@/utils/recommendations";

const MONGO_URI = process.env.MONGO_URI!;
const DB_NAME = process.env.DB_NAME!;
const CACHE_EXPIRATION = 2 * 60 * 60 * 1000; // 2 hours in milliseconds

let client: MongoClient | null = null;

// Cache structures
let articlesCache: { articles: Article[]; lastUpdated: number } = { articles: [], lastUpdated: 0 };
const personalizedCache: Record<string, { articles: Article[]; lastUpdated: number }> = {};

// User type definition
type User = {
  _id: ObjectId;
  name: string;
  email: string;
  image: string;
  createdAt: Date;
  preferences: string[];
  savedArticles: string[];
  tagHistory: Record<string, number>;
};

type Article = {
  _id: ObjectId;
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  datePublished: string;
  url: string;
  category: string;
  topics: string[];
  saved: boolean;
};

async function getClient() {
  if (!client) {
    client = new MongoClient(MONGO_URI);
    await client.connect();
  }
  return client;
}

async function fetchArticlesFromDB(): Promise<Article[]> {
  const client = await getClient();
  const db = client.db(DB_NAME);
  const collection = db.collection<Article>("Articles");

  const articles = await collection
    .find({})
    .sort({ datePublished: -1 }) // Sort by most recent first
    .toArray();

  return articles;
}

async function fetchUserFromDB(email: string): Promise<User | null> {
  const client = await getClient();
  const db = client.db(DB_NAME);
  const usersCollection = db.collection<User>("Users");

  const user = await usersCollection.findOne({ email });
  if (!user) return null;

  // Transform the fetched user document into a `User` object
  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    image: user.image,
    createdAt: user.createdAt,
    preferences: user.preferences || [], // Ensure preferences is an array
    savedArticles: user.savedArticles || [],
    tagHistory: user.tagHistory || {},
  };
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const email = url.searchParams.get("email");
    const page = parseInt(url.searchParams.get("page") || "0", 10);

    if (isNaN(page) || page < 0) {
      return NextResponse.json({ error: "Invalid page parameter" }, { status: 400 });
    }

    // Cache management for default articles
    const now = Date.now();
    if (now - articlesCache.lastUpdated > CACHE_EXPIRATION) {
      console.log("Refreshing default articles cache...");
      const articles = await fetchArticlesFromDB();
      articlesCache = { articles, lastUpdated: now };
    }

    const cachedArticles = articlesCache.articles;

    if (email) {
      // Check if personalized articles are cached
      const cachedPersonalized = personalizedCache[email];
      if (cachedPersonalized && now - cachedPersonalized.lastUpdated <= CACHE_EXPIRATION && page >= 1) {
        console.log(`Serving cached personalized articles for ${email}`);
      } else {
        // Fetch user from database
        const user = await fetchUserFromDB(email);
        if (!user) {
          return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Rank articles using the provided function
        const personalizedArticles = rankArticles(user, cachedArticles);

        // Cache the personalized articles
        personalizedCache[email] = {
          articles: personalizedArticles,
          lastUpdated: now,
        };

        console.log(`Generated and cached personalized articles for ${email}`);
      }

      // Paginate personalized articles
      const personalizedArticles = personalizedCache[email].articles;
      const limit = 9;
      const start = page * limit;
      const end = start + limit;
      const paginatedPersonalizedArticles = personalizedArticles.slice(start, end);

      return NextResponse.json(paginatedPersonalizedArticles);
    }

    // Default response: Paginate articles from the cache
    const limit = 9;
    const start = page * limit;
    const end = start + limit;
    const paginatedArticles = cachedArticles.slice(start, end);

    return NextResponse.json(paginatedArticles);
  } catch (error) {
    console.error("Error fetching articles:", error);
    return NextResponse.json({ error: "Failed to fetch articles" }, { status: 500 });
  }
}
