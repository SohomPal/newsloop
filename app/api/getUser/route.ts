import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

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

// API Route Handler
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

        // Find the user by email
        const user = await users.findOne({ email });
        if (!user) {
            return NextResponse.json(
                { error: "User not found." },
                { status: 404 }
            );
        }

        // Check if the user has a `newUser` property
        let newUser = user.newUser || false;
        if (newUser) {
            // Remove the `newUser` property from the database
            await users.updateOne(
                { email },
                { $unset: { newUser: "" } } // Remove `newUser` property
            );
        }

        // Return the user, including `newUser` in the response
        return NextResponse.json({
            message: "User fetched successfully.",
            user: { ...user, newUser },
        });
    } catch (error) {
        console.error("Error fetching user:", error);
        return NextResponse.json(
            { error: "Failed to fetch user." },
            { status: 500 }
        );
    }
}
