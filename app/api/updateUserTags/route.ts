import { NextResponse } from "next/server";
import { MongoClient } from 'mongodb';

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
        const { email, tags } = body;

        // Validate input
        if (!email || !Array.isArray(tags)) {
            return NextResponse.json(
                { error: "Invalid request data. `email` and an array of `tags` are required." },
                { status: 400 }
            );
        }

        // Connect to the database
        const client = await getClient();
        const db = client.db(DB_NAME);
        const users = db.collection('Users');

        // Find the user
        const user = await users.findOne({ email });
        if (!user) {
            return NextResponse.json(
                { error: "User not found." },
                { status: 404 }
            );
        }

        // Build the update object
        const tagUpdates = tags.reduce((updates, tag) => {
            updates[`tagHistory.${tag}`] = 1; // Increment each tag by 1
            return updates;
        }, {});

        // Update the user's tag history
        await users.updateOne(
            { email },
            { $inc: tagUpdates } // Increment the counts for each tag
        );

        // Return success response
        return NextResponse.json({
            message: "User tag history updated successfully.",
        });
    } catch (error) {
        console.error("Error updating user tag history:", error);
        return NextResponse.json(
            { error: "Failed to update user tag history." },
            { status: 500 }
        );
    }
}
