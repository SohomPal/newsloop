import { NextResponse } from "next/server";
import { MongoClient, ObjectId } from 'mongodb';

const MONGO_URI = process.env.MONGO_URI;
const DB_NAME = process.env.DB_NAME;

let client: MongoClient | null = null;

// Function to get or initialize MongoDB client
async function getClient() {
    if (!client) {
        client = new MongoClient(MONGO_URI!);
        await client.connect();
    }
    return client;
}

// Handler for GET request
export async function GET(req: Request) {
    try {
        // Extract email from query parameters
        const url = new URL(req.url);
        const email = url.searchParams.get('email');

        // Validate email
        if (!email) {
            return NextResponse.json(
                { error: "Invalid request. `email` query parameter is required." },
                { status: 400 }
            );
        }

        // Connect to the database
        const client = await getClient();
        const db = client.db(DB_NAME);
        const users = db.collection('Users');
        const articles = db.collection('Articles');

        // Find the user
        const user = await users.findOne({ email });
        if (!user) {
            return NextResponse.json(
                { error: "User not found." },
                { status: 404 }
            );
        }

        // Get the list of saved article IDs
        const savedArticleIDs = user.savedArticles || [];
        if (savedArticleIDs.length === 0) {
            return NextResponse.json({
                message: "No saved articles found.",
                articles: [],
            });
        }

         // Convert savedArticleIDs to ObjectId
         const objectIds = savedArticleIDs.map((id: string) => new ObjectId(id));

         // Fetch the articles from the Articles collection
         const savedArticles = await articles
             .find({ _id: { $in: objectIds } })
             .toArray();

        // Return the list of saved articles
        return NextResponse.json({
            message: "Saved articles fetched successfully.",
            articles: savedArticles,
        });
    } catch (error) {
        console.error("Error fetching saved articles:", error);
        return NextResponse.json(
            { error: "Failed to fetch saved articles." },
            { status: 500 }
        );
    }
}
