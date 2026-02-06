import { betterAuth } from "better-auth";
import { Db, MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { createAuthClient } from "better-auth/client";

// MongoDB Connection - lazy initialization
let client: MongoClient;
let db: Db;

function getClient() {
    if (!client) {
        client = new MongoClient(process.env.MONGODB_URI!);
    }
    return client;
}

export function getDb(): Db {
    if (!db) {
        db = getClient().db();
    }
    return db;
}

export const auth = betterAuth({
    baseURL: process.env.BETTER_AUTH_BASE_URL || "http://localhost:3000",
    database: mongodbAdapter(getDb(), {
        client: getClient()
    }),
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            redirectUri: `${process.env.BETTER_AUTH_BASE_URL || "http://localhost:3000"}/api/auth/callback/google`
        },
    },
});

export const authClient = createAuthClient({});
