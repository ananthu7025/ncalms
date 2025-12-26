// Database reset script - Clears all data then reseeds
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { db, schema } from "./lib/db/index";
import { sql } from "drizzle-orm";

async function resetDatabase() {
  try {
    console.log("🗑️  Starting database reset...\n");

    // Delete data from tables in correct order (child tables first to avoid FK violations)
    console.log("Deleting cart items...");
    await db.delete(schema.cart);

    console.log("Deleting user access records...");
    await db.delete(schema.userAccess);

    console.log("Deleting purchases...");
    await db.delete(schema.purchases);

    console.log("Deleting subject contents...");
    await db.delete(schema.subjectContents);

    console.log("Deleting password reset tokens...");
    await db.delete(schema.passwordResetTokens);

    console.log("Deleting subjects...");
    await db.delete(schema.subjects);

    console.log("Deleting exam types...");
    await db.delete(schema.examTypes);

    console.log("Deleting users...");
    await db.delete(schema.users);

    console.log("Deleting email templates...");
    await db.delete(schema.emailTemplates);

    console.log("Deleting content types...");
    await db.delete(schema.contentTypes);

    console.log("Deleting learning streams...");
    await db.delete(schema.learningStreams);

    console.log("Deleting platform settings...");
    await db.delete(schema.platformSettings);

    console.log("Deleting roles...");
    await db.delete(schema.roles);

    console.log("\n✅ All data cleared successfully!\n");
    console.log("Now running seed script...\n");

    // Import and run the seed script
    const seed = (await import("./seed")).default;
    await seed();

    console.log("\n🎉 Database reset and seed completed successfully!");
  } catch (err) {
    console.error("❌ Reset error:", err);
    throw err;
  }
}

if (require.main === module) {
  resetDatabase()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

export default resetDatabase;
