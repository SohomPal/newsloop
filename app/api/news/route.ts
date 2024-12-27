import { NextResponse } from "next/server";
import { MongoClient } from 'mongodb'

const MONGO_URI = process.env.MONGO_URI
const DB_NAME = process.env.DB_NAME

let client : MongoClient | null = null;

async function getClient() {
    if (!client){
        client = new MongoClient(MONGO_URI!);
        await client.connect();
    }
    return client
}

export async function GET() {
  try {
        const client = await getClient();
        const db = client.db(DB_NAME)
        const collection = db.collection('Articles')

        const articles = await collection.find({}).toArray();


    // Send the articles back to the frontend
    return NextResponse.json(articles);
  } catch (error) {
    console.error('Error fetching news from DB:', error)
    return NextResponse.json({ error: "Failed to fetch news" }, { status: 500 });
  }
}
