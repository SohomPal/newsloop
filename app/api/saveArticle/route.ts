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

// Handler for POST request
export async function POST(req: Request) {
    try {
        // Parse the incoming request body
        const body = await req.json();
        const { email, articleID } = body;

        // Validate input
        if (!email || !articleID) {
            return NextResponse.json(
                { error: "Invalid request data. `email` and `articleID` are required." },
                { status: 400 }
            );
        }

        // Connect to the database
        const client = await getClient();
        const db = client.db(DB_NAME);
        const users = db.collection('Users');
        const articles = db.collection('Articles');

        // Check if the article exists in the Articles collection
        const article = await articles.findOne({ _id: new ObjectId(articleID) });
        if (!article) {
            return NextResponse.json(
                { error: "Article not found." },
                { status: 404 }
            );
        }

        // Find the user
        const user = await users.findOne({ email });
        if (!user) {
            return NextResponse.json(
                { error: "User not found." },
                { status: 404 }
            );
        }

        // Check if the article is already saved
        const isSaved = user.savedArticles?.includes(articleID);
        const tags = article.topics

        if (isSaved) {
            // If the article is already saved, remove it from user's saved list
            // @ts-expect-error
            const tagUpdates = tags.reduce((updates, tag) => {
                updates[`tagHistory.${tag}`] = -1; // Decrement each tag by 1
                return updates;
            }, {});
            
            await users.updateOne(
                { email },
                { $pull: { savedArticles: articleID }, $inc: tagUpdates }, // Remove the article from the saved list
            );

            // Mark the article as unsaved in the Articles collection
            await articles.updateOne(
                { _id: articleID },
                { $set: { saved: false } } // Set the article as unsaved
            );
        } else {
            // If the article is not saved, add it to user's saved list
            // @ts-expect-error
            const tagUpdates = tags.reduce((updates, tag) => {
                updates[`tagHistory.${tag}`] = 1; // Increment each tag by 1
                return updates;
            }, {});

            await users.updateOne(
                { email },
                { $addToSet: { savedArticles: articleID }, $inc: tagUpdates }, // Add the article to the saved list
            );

            // Mark the article as saved in the Articles collection
            await articles.updateOne(
                { _id: articleID },
                { $set: { saved: true } } // Set the article as saved
            );
        }

        // Return success response
        return NextResponse.json({
            message: isSaved
                ? "Article successfully removed from saved list."
                : "Article successfully added to saved list.",
        });
    } catch (error) {
        console.error("Error updating saved articles:", error);
        return NextResponse.json(
            { error: "Failed to update saved articles." },
            { status: 500 }
        );
    }
}
