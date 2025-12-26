// Database seed script
// IMPORTANT: Load environment variables FIRST before any other imports
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

// Now import database after env vars are loaded
import { db, schema } from "./lib/db/index";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

async function seed() {
  try {
    console.log("Starting database seed...");

    // ==========================
    // Roles
    // ==========================
    console.log("Ensuring roles exist...");
    await db.insert(schema.roles)
      .values([
        { name: "USER", description: "Regular user with basic access" },
        { name: "ADMIN", description: "Administrator with full access" },
      ])
      .onConflictDoNothing();

    const [adminRole, userRole] = await Promise.all([
      db.select().from(schema.roles).where(eq(schema.roles.name, "ADMIN")).then(r => r[0]),
      db.select().from(schema.roles).where(eq(schema.roles.name, "USER")).then(r => r[0]),
    ]);

    if (!adminRole || !userRole) throw new Error("Roles not found after seeding");
    console.log("Roles ready");

    // ==========================
    // Users
    // ==========================
    console.log("Creating admin user...");
    const adminHash = await bcrypt.hash("admin123", 12);
    await db.insert(schema.users)
      .values({
        name: "Admin User",
        email: "admin@example.com",
        passwordHash: adminHash,
        roleId: adminRole.id,
        isActive: true,
      })
      .onConflictDoNothing();
    console.log("Admin user ready");

    console.log("Creating test user...");
    const userHash = await bcrypt.hash("user123", 12);
    await db.insert(schema.users)
      .values({
        name: "Test User",
        email: "user@example.com",
        passwordHash: userHash,
        roleId: userRole.id,
        isActive: true,
      })
      .onConflictDoNothing();
    console.log("Test user ready");

    // ==========================
    // Learning Streams
    // ==========================
    console.log("Creating learning streams...");
    await db.insert(schema.learningStreams)
      .values([
        { name: "NCA", description: "National Committee on Accreditation Subjects" },
        { name: "Ontario Bar", description: "Ontario Bar Examination prep" },
      ])
      .onConflictDoNothing();

    const streams = await db.select().from(schema.learningStreams);
    const ncaStream = streams.find(s => s.name === "NCA");
    const ontarioStream = streams.find(s => s.name === "Ontario Bar");

    if (!ncaStream || !ontarioStream) throw new Error("Learning Streams missing after seed");
    console.log("Learning streams ready");

    // ==========================
    // Exam Types (Ontario Bar)
    // ==========================
    console.log("Creating exam types...");
    await db.insert(schema.examTypes)
      .values([
        { streamId: ontarioStream.id, name: "Solicitor", description: "Solicitor licensing exam" },
        { streamId: ontarioStream.id, name: "Barrister", description: "Barrister licensing exam" },
      ])
      .onConflictDoNothing();

    const examTypes = await db.select()
      .from(schema.examTypes)
      .where(eq(schema.examTypes.streamId, ontarioStream.id));

    const solicitorExam = examTypes.find(e => e.name === "Solicitor");
    const barristerExam = examTypes.find(e => e.name === "Barrister");
    console.log("Exam types ready");

    // ==========================
    // Content Types
    // ==========================
    console.log("Creating content types...");
    await db.insert(schema.contentTypes)
      .values([
        { name: "VIDEO", description: "Video content" },
        { name: "PDF", description: "PDF learning docs" },
        { name: "Question Bank", description: "Mock tests & question banks" },
      ])
      .onConflictDoNothing();

    console.log("Content types ready");

    // ==========================
    // Subjects
    // ==========================
    console.log("Creating subjects...");

    const subjectsData = [
      // NCA Subjects
      {
        streamId: ncaStream.id,
        examTypeId: null,
        title: "Professional Responsibility",
        description: "Ethics, professional conduct, and lawyer-client relationships.",
        thumbnail: "/images/subjects/professional-responsibility.jpg",
        demoVideoUrl: "https://youtu.be/fiaTIN6g5fI?si=ggrx2u6HZYnd0P6i",
        isActive: true,
        bundle_price: "200.00",
        is_bundle_enabled: true,
      },
      {
        streamId: ncaStream.id,
        examTypeId: null,
        title: "Canadian Administrative Law",
        description: "Navigate government decision-making and regulatory frameworks.",
        thumbnail: "/images/subjects/administrative-law.jpg",
        demoVideoUrl: "https://youtu.be/UImrau29cu8?si=TgaknMmLZp3lMbl7",
        isActive: true,
        bundle_price: "200.00",
        is_bundle_enabled: true,
      },
      {
        streamId: ncaStream.id,
        examTypeId: null,
        title: "Canadian Constitutional Law",
        description: "Master the foundations of Canada's constitutional framework and charter rights.",
        thumbnail: "/images/subjects/constitutional-law.jpg",
        demoVideoUrl: "https://youtu.be/_9ye3TCzVp8?si=jpZRW6AN5cvZL4_Q",
        isActive: true,
        bundle_price: "200.00",
        is_bundle_enabled: true,
      },
      {
        streamId: ncaStream.id,
        examTypeId: null,
        title: "Canadian Criminal Law",
        description: "Comprehensive coverage of criminal procedures, offenses, and defenses.",
        thumbnail: "/images/subjects/criminal-law.jpg",
        demoVideoUrl: "https://youtu.be/dz3ik3XzR54?si=u9m5QdBG06c3CUha",
        isActive: true,
        bundle_price: "200.00",
        is_bundle_enabled: true,
      },
      {
        streamId: ncaStream.id,
        examTypeId: null,
        title: "Foundations of Canadian Law",
        description: "Essential legal principles and the Canadian legal system overview.",
        thumbnail: "/images/subjects/foundations-law.jpg",
        demoVideoUrl: "https://youtu.be/GDF2gFC-zlM?si=8Ucll1YmTeMHSrl4",
        isActive: true,
        bundle_price: "200.00",
        is_bundle_enabled: true,
      },
      {
        streamId: ncaStream.id,
        examTypeId: null,
        title: "Legal Research and Writing",
        description: "Professional research assistance and writing guidance.",
        thumbnail: "/images/subjects/legal-research.jpg",
        demoVideoUrl: "https://youtu.be/4Bsc2uI_LsM?si=DN6UooasGRCDvqMI",
        isActive: true,
        bundle_price: "200.00",
        is_bundle_enabled: true,
      },
      // Ontario Bar Subjects
      {
        streamId: ontarioStream.id,
        examTypeId: null,
        title: "Ontario Bar General Overview",
        description: "Non-exam specific subject covering general bar requirements",
        thumbnail: "/images/subjects/ontario-bar-general.jpg",
        demoVideoUrl: "https://youtu.be/6LD30ChPsSs?si=qPE9QPc_Y1OzK22B",
        isActive: true,
        bundle_price: "250.00",
        is_bundle_enabled: true,
      },
      {
        streamId: ontarioStream.id,
        examTypeId: solicitorExam?.id ?? null,
        title: "Solicitor — Civil Litigation",
        description: "Complete preparation for the Solicitor track civil litigation exam",
        thumbnail: "/images/subjects/solicitor-civil.jpg",
        demoVideoUrl: "https://youtu.be/Y23dN3JZrcE?si=6b0OxmUwnN96mmjM",
        isActive: true,
        bundle_price: "200.00",
        is_bundle_enabled: true,
      },
      {
        streamId: ontarioStream.id,
        examTypeId: barristerExam?.id ?? null,
        title: "Barrister — Criminal Law",
        description: "Complete preparation for the Barrister track criminal law exam",
        thumbnail: "/images/subjects/barrister-criminal.jpg",
        demoVideoUrl: "https://youtu.be/Eo9hZz3oizk?si=nJhee6pk5-u9h2Ip",
        isActive: true,
        bundle_price: "250.00",
        is_bundle_enabled: true,
      },
    ];

    await db.insert(schema.subjects)
      .values(subjectsData)
      .onConflictDoNothing();

    const subjects = await db.select().from(schema.subjects);
    console.log("Subjects ready");

    console.log("\n🎉 Database seeded successfully!");
    console.log("\nTest users:");
    console.log("Admin: admin@example.com / admin123");
    console.log("User: user@example.com / user123");
    // ==========================
    // Email Templates
    // ==========================
    console.log("Creating email templates...");
    const emailTemplatesData = [
      {
        name: "RESET_PASSWORD",
        subject: "Reset Your Password - NCA LMS",
        htmlContent: `
          <!DOCTYPE html>
          <html>
          <head>
              <style>
                  body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                  .container { max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; }
                  .header { text-align: center; margin-bottom: 20px; }
                  .btn { display: inline-block; background-color: #1a56db; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold; }
                  .footer { margin-top: 30px; font-size: 0.8rem; color: #888; text-align: center; }
              </style>
          </head>
          <body>
              <div class="container">
                  <div class="header">
                      <h2>Password Reset Request</h2>
                  </div>
                  <p>Hello,</p>
                  <p>We received a request to reset your password for your NCA LMS account. If you didn't make this request, you can safely ignore this email.</p>
                  <p>To reset your password, click the button below:</p>
                  <p style="text-align: center;">
                      <a href="{{resetLink}}" class="btn">Reset Password</a>
                  </p>
                  <p>Or copy and paste this link into your browser:</p>
                  <p>{{resetLink}}</p>
                  <p>This link will expire in 1 hour.</p>
                  <div class="footer">
                      <p>&copy; 2024 NCA LMS. All rights reserved.</p>
                  </div>
              </div>
          </body>
          </html>
        `,
        textContent: `
          Password Reset Request
          
          Hello,
          
          We received a request to reset your password for your NCA LMS account. If you didn't make this request, you can safely ignore this email.
          
          To reset your password, visit the link below:
          {{resetLink}}
          
          This link will expire in 1 hour.
          
          © 2024 NCA LMS. All rights reserved.
        `,
      },
    ];

    for (const template of emailTemplatesData) {
      await db.insert(schema.emailTemplates)
        .values({
          name: template.name,
          subject: template.subject,
          htmlContent: template.htmlContent,
          textContent: template.textContent,
        })
        .onConflictDoUpdate({
          target: schema.emailTemplates.name,
          set: {
            subject: template.subject,
            htmlContent: template.htmlContent,
            textContent: template.textContent,
            updatedAt: new Date(),
          },
        });
    }
    console.log("Email templates ready");

    // ==========================
    // Session Types
    // ==========================
    console.log("Creating session types...");
    const sessionTypesData = [
      {
        title: "NCA Assessment Process Guidance",
        description: "Get expert guidance on the NCA assessment process, including credential evaluation and next steps.",
        duration: 30,
        price: "10.00",
        isActive: true,
      },
      {
        title: "NCA Exam Preparation Guidance",
        description: "Personalized exam preparation strategies and study plans tailored to your needs.",
        duration: 30,
        price: "10.00",
        isActive: true,
      },
      {
        title: "Teaching / Answer Writing",
        description: "One-on-one teaching session on any topic or answer writing guidance to improve your exam performance.",
        duration: 60,
        price: "50.00",
        isActive: true,
      },
    ];

    await db.insert(schema.sessionTypes)
      .values(sessionTypesData)
      .onConflictDoNothing();

    const sessionTypes = await db.select().from(schema.sessionTypes);
    console.log("Session types ready");

    console.log(`\nSeeded ${subjects.length} subjects and ${sessionTypes.length} session types\n`);

  } catch (err) {
    console.error("❌ Seed error:", err);
    throw err;
  }
}

if (require.main === module) {
  seed()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

export default seed;
