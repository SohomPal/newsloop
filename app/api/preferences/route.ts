import { NextResponse } from "next/server";
import { MongoClient } from 'mongodb'

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

// Handler for POST request
export async function POST(req: Request) {
    try {
        // Parse the incoming request body
        const body = await req.json();
        const { email, preferences } = body;

        // Validate input
        if (!email || !Array.isArray(preferences)) {
            return NextResponse.json(
                { error: "Invalid request data. `email` and `preferences` are required." },
                { status: 400 }
            );
        }

        // Connect to the database
        const client = await getClient();
        const db = client.db(DB_NAME);
        const collection = db.collection('Users');

        // Update or insert user preferences
        const result = await collection.updateOne(
            { email }, // Find the user by email
            { $set: { preferences } }, // Update preferences
            { upsert: true } // Create a new document if one doesn't exist
        );

        // Return success response
        return NextResponse.json({
            message: "Preferences updated successfully",
            result: result.upsertedId ? "Inserted new user" : "Updated existing user"
        });
    } catch (error) {
        console.error('Error updating preferences for user:', error);
        return NextResponse.json(
            { error: "Failed to update user preferences" },
            { status: 500 }
        );
    }
}

// GET handler: Fetch user preferences
export async function GET(req: Request) {
    try {
        // Extract email from query parameters
        const url = new URL(req.url);
        const email = url.searchParams.get("email");

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
        const users = db.collection("Users");

        // Find the user
        const user = await users.findOne({ email });
        if (!user) {
            return NextResponse.json(
                { error: "User not found." },
                { status: 404 }
            );
        }

        // Retrieve user preferences (e.g., tagHistory)
        const preferences = user.preferences || [];

        // Return the preferences
        return NextResponse.json({
            message: "User preferences fetched successfully.",
            preferences,
        });
    } catch (error) {
        console.error("Error fetching user preferences:", error);
        return NextResponse.json(
            { error: "Failed to fetch user preferences." },
            { status: 500 }
        );
    }
}