import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";
import * as dotenv from "dotenv";

// Load environment variables from .env.local if not already loaded
if (!process.env.DATABASE_URL) {
  dotenv.config({ path: ".env.local" });
}

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set in environment variables");
}

// Create postgres connection
const connectionString = process.env.DATABASE_URL;

// For query purposes
const queryClient = postgres(connectionString);

// Create drizzle instance
export const db = drizzle(queryClient, { schema });

// Export schema for convenience
export { schema };

// Export types
export type Database = typeof db;
