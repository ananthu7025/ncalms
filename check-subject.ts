
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { db, schema } from "./lib/db/index";
import { eq } from "drizzle-orm";
import * as fs from 'fs';

async function check() {
    const id = "5e031596-0c12-4d85-aead-7e1c908f8e51";
    console.log(`Checking subject ${id}...`);

    const result = await db
        .select()
        .from(schema.subjects)
        .where(eq(schema.subjects.id, id));

    if (result.length === 0) {
        console.log("Subject not found");
    } else {
        const s = result[0];

        let logContent = `Subject Found:\nTitle: ${s.title}\nSyllabus Topics (Type): ${typeof s.syllabusTopics}\n`;
        logContent += `Syllabus Topics (Raw Legacy): ${s.syllabusTopics}\n`;

        // Try parsing
        if (s.syllabusTopics) {
            try {
                const parsed = JSON.parse(s.syllabusTopics);
                logContent += `JSON Parse Success: ${JSON.stringify(parsed, null, 2)}`;
            } catch (e: any) {
                logContent += `JSON Parse Error: ${e.message}\n`;
                logContent += `Parse failed on string: >>${s.syllabusTopics}<<`;
            }
        } else {
            logContent += "Syllabus topics is null/undefined";
        }

        fs.writeFileSync('debug_log.txt', logContent);
        console.log("Logged to debug_log.txt");
    }
    process.exit(0);
}

check().catch(console.error);
