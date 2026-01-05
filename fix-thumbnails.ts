import * as dotenv from "dotenv";
import { db, schema } from "./lib/db/index";
import { eq } from "drizzle-orm";

dotenv.config({ path: ".env.local" });

const updates = [
    { title: "Property Law", thumbnail: "/images/subjects/property-law.png" },
    { title: "Torts", thumbnail: "/images/subjects/torts.png" },
    { title: "Business Organization", thumbnail: "/images/subjects/business-organization.png" },
    { title: "Contracts", thumbnail: "/images/subjects/contracts.png" },
    { title: "Business Law", thumbnail: "/images/subjects/ontario-business-law.png" },
    { title: "Estate Planning", thumbnail: "/images/subjects/ontario-estate-planning.png" },
    { title: "Real Estate Law", thumbnail: "/images/subjects/ontario-real-estate.png" },
    { title: "Professional Responsibility (Solicitor)", thumbnail: "/images/subjects/ontario-prof-resp-solicitor.png" },
    { title: "Civil Litigation", thumbnail: "/images/subjects/ontario-civil-litigation.png" },
    { title: "Criminal Law (Barrister)", thumbnail: "/images/subjects/ontario-criminal-law.png" },
    { title: "Family Law", thumbnail: "/images/subjects/ontario-family-law.png" },
    { title: "Public Law", thumbnail: "/images/subjects/ontario-public-law.png" },
    { title: "Professional Responsibility (Barrister)", thumbnail: "/images/subjects/ontario-prof-resp-barrister.png" },
];

async function main() {
    console.log("Starting thumbnail updates...");

    for (const update of updates) {
        console.log(`Updating ${update.title}...`);
        await db.update(schema.subjects)
            .set({ thumbnail: update.thumbnail })
            .where(eq(schema.subjects.title, update.title));
    }

    console.log("Updates complete!");
    process.exit(0);
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
