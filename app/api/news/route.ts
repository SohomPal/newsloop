import { NextResponse } from "next/server";
import { MongoClient } from 'mongodb'

const MONGO_URI = process.env.MONGO_URI;
const DB_NAME = process.env.DB_NAME;

let client: MongoClient | null = null;

async function getClient() {
    if (!client) {
        client = new MongoClient(MONGO_URI!);
        await client.connect();
    }
    return client;
}

export async function GET(req: Request) {
  try {
        const client = await getClient();
        const db = client.db(DB_NAME);
        const collection = db.collection('Articles');

        // Parse the "page" parameter from the query string
        const url = new URL(req.url);
        const page = parseInt(url.searchParams.get("page") || "0", 10);

        if (isNaN(page) || page < 0) {
            return NextResponse.json({ error: "Invalid page parameter" }, { status: 400 });
        }

        // Pagination logic
        const limit = 9;
        const skip = page * limit;

        // Fetch articles from the database
        const articles = await collection
            .find({})
            .sort({ datePublished: -1 }) // Sort by most recent first (assumes a `publishedAt` field in the collection)
            .skip(skip)
            .limit(limit)
            .toArray();

        return NextResponse.json(articles);
  } catch (error) {
        console.error('Error fetching news from DB:', error);
        return NextResponse.json({ error: "Failed to fetch news" }, { status: 500 });
  }
}
