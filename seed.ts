// Database seed script
// IMPORTANT: Load environment variables FIRST before any other imports
import * as dotenv from "dotenv";
import { fileURLToPath } from "url";

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
        { name: "IRACs", description: "Essay Answer Structures" },
      ])
      .onConflictDoNothing();

    const contentTypes = await db.select().from(schema.contentTypes);
    const videoType = contentTypes.find(ct => ct.name === "VIDEO");
    const pdfType = contentTypes.find(ct => ct.name === "PDF");
    const questionBankType = contentTypes.find(ct => ct.name === "Question Bank");
    const iracsType = contentTypes.find(ct => ct.name === "IRACs");

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
        bundle_price: "300.00",
        is_bundle_enabled: true,
        syllabusTopics: JSON.stringify([
          "A. The Legal Profession",
          "1. Professions and Professionalism",
          "2. Regulation of Lawyers and Regulation of the Legal Profession",
          "B. Ethics, Lawyering and Professional Regulation",
          "1. The Lawyer-Client Relationship",
          "2. The Preservation of Client Confidences",
          "3. Conflicts of Interest",
          "4. The Adversary System and Lawyers as Advocates",
          "C. Some Specific Practice Areas",
          "1. Ethics and Dispute Resolution: Counselling and Negotiation",
          "2. Ethics and the Practice of Criminal Law",
          "3. Government Lawyers",
          "4. Lawyers in Organizational Settings",
          "D. Access to Justice"
        ]),
        additionalCoverage: `• Detailed Study of the Model Code of Professional Conduct, 2024
• Detailed Study of Syllabus Articles & Case Laws (latest NCA updates)
• IRAC & Essay Writing Techniques
• NCA Sample Papers with Answers
• Practice Papers & Mock Exams`
      },

      {
        streamId: ncaStream.id,
        examTypeId: null,
        title: "Canadian Administrative Law",
        description: "Government decision-making, judicial review, and regulatory frameworks.",
        thumbnail: "/images/subjects/administrative-law.jpg",
        demoVideoUrl: "https://youtu.be/UImrau29cu8?si=TgaknMmLZp3lMbl7",
        isActive: true,
        bundle_price: "300.00",
        is_bundle_enabled: true,
        syllabusTopics: JSON.stringify([
          "1. Sources of Administrative Law",
          "2. Procedural Fairness",
          "3. Legitimate Expectations",
          "4. Duty to Consult Indigenous Peoples",
          "5. Charter & Bill of Rights in Admin Law",
          "6. Standard of Review – Vavilov Framework",
          "7. Judicial Review Procedure",
          "8. Remedies"
        ]),
        additionalCoverage: `• Latest NCA Case Laws
• Answer Writing for Problem Questions
• Sample & Mock Exams`
      },

      {
        streamId: ncaStream.id,
        examTypeId: null,
        title: "Canadian Constitutional Law",
        description: "Foundations of Canada's Constitution and Charter rights.",
        thumbnail: "/images/subjects/constitutional-law.jpg",
        demoVideoUrl: "https://youtu.be/_9ye3TCzVp8?si=jpZRW6AN5cvZL4_Q",
        isActive: true,
        bundle_price: "300.00",
        is_bundle_enabled: true,
        syllabusTopics: JSON.stringify([
          "1. Sources of the Constitution",
          "2. Federalism",
          "3. Division of Powers",
          "4. Judicial Review",
          "5. Aboriginal & Treaty Rights",
          "6. Charter Interpretation",
          "7. Fundamental Freedoms",
          "8. Equality Rights",
          "9. Limitations & Remedies"
        ]),
        additionalCoverage: `• Updated Charter Case Laws
• Essay Writing Frameworks
• Sample & Practice Papers`
      },

      {
        streamId: ncaStream.id,
        examTypeId: null,
        title: "Canadian Criminal Law",
        description: "Criminal offences, procedure, and defences.",
        thumbnail: "/images/subjects/criminal-law.jpg",
        demoVideoUrl: "https://youtu.be/dz3ik3XzR54?si=u9m5QdBG06c3CUha",
        isActive: true,
        bundle_price: "300.00",
        is_bundle_enabled: true,
        syllabusTopics: JSON.stringify([
          "1. Sources of Criminal Law",
          "2. Actus Reus",
          "3. Mens Rea",
          "4. Regulatory Offences",
          "5. Parties to an Offence",
          "6. Attempts",
          "7. Defences",
          "8. Police Powers",
          "9. Bail & Disclosure",
          "10. Trial Process",
          "11. Sentencing",
          "12. Appeals"
        ]),
        additionalCoverage: `• Annotated Criminal Code Usage
• Case Law Analysis
• Mock Exams & Answer Keys`
      },

      {
        streamId: ncaStream.id,
        examTypeId: null,
        title: "Foundations of Canadian Law",
        description: "Overview of legal theory, institutions, and Canadian legal system.",
        thumbnail: "/images/subjects/foundations-law.jpg",
        demoVideoUrl: "https://youtu.be/GDF2gFC-zlM?si=8Ucll1YmTeMHSrl4",
        isActive: true,
        bundle_price: "300.00",
        is_bundle_enabled: true,
        syllabusTopics: JSON.stringify([
          "1. Legal Theories",
          "2. Indigenous Peoples and Law",
          "3. Sources of Law",
          "4. Constitutional Principles",
          "5. Parliament",
          "6. Executive",
          "7. Judiciary",
          "8. Statutory Interpretation",
          "9. Judicial Review"
        ]),
        additionalCoverage: `• Concise Notes
• Essay Structuring
• Sample Papers`
      },

      {
        streamId: ncaStream.id,
        examTypeId: null,
        title: "Property Law",
        description: "Canadian land law, estates, and proprietary interests.",
        thumbnail: "/images/subjects/property-law.png",
        demoVideoUrl: null,
        isActive: true,
        bundle_price: "300.00",
        is_bundle_enabled: true,
        syllabusTopics: JSON.stringify([
          "1. Nature of Property",
          "2. Possession",
          "3. Estates",
          "4. Aboriginal Title",
          "5. Trusts & Equity",
          "6. Future Interests",
          "7. Leases & Licences",
          "8. Co-ownership",
          "9. Easements & Covenants",
          "10. Registration & Priorities"
        ]),
        additionalCoverage: `• Case Law Summaries
• Problem Question Techniques
• Practice Exams`
      },

      {
        streamId: ncaStream.id,
        examTypeId: null,
        title: "Torts",
        description: "Civil wrongs and remedies under Canadian law.",
        thumbnail: "/images/subjects/torts.png",
        demoVideoUrl: null,
        isActive: true,
        bundle_price: "300.00",
        is_bundle_enabled: true,
        syllabusTopics: JSON.stringify([
          "1. Intentional Torts",
          "2. Negligence",
          "3. Duty of Care",
          "4. Causation",
          "5. Defences",
          "6. Occupiers’ Liability",
          "7. Product Liability",
          "8. Defamation",
          "9. Economic Torts"
        ]),
        additionalCoverage: `• IRAC Application
• Leading Case Laws
• Mock & Practice Papers`
      },

      {
        streamId: ncaStream.id,
        examTypeId: null,
        title: "Business Organization",
        description: "Partnerships, corporations, governance and remedies.",
        thumbnail: "/images/subjects/business-organization.png",
        demoVideoUrl: null,
        isActive: true,
        bundle_price: "300.00",
        is_bundle_enabled: true,
        syllabusTopics: JSON.stringify([
          "1. Forms of Business",
          "2. Partnerships",
          "3. Incorporation",
          "4. Corporate Personality",
          "5. Shares & Shareholders",
          "6. Directors & Officers",
          "7. Corporate Changes",
          "8. Duties & Liabilities",
          "9. Shareholder Remedies"
        ]),
        additionalCoverage: `• Corporate Case Laws
• Essay & Problem Answers
• Mock Exams`
      },

      {
        streamId: ncaStream.id,
        examTypeId: null,
        title: "Contracts",
        description: "Contract formation, performance, breach, and remedies.",
        thumbnail: "/images/subjects/contracts.png",
        demoVideoUrl: null,
        isActive: true,
        bundle_price: "300.00",
        is_bundle_enabled: true,
        syllabusTopics: JSON.stringify([
          "1. Formation",
          "2. Offer & Acceptance",
          "3. Consideration",
          "4. Intention",
          "5. Privity",
          "6. Terms",
          "7. Misrepresentation",
          "8. Breach",
          "9. Remedies",
          "10. Discharge"
        ]),
        additionalCoverage: `• Leading Contract Cases
• Answer Writing Frameworks
• Sample & Practice Papers`
      },
      // ============================================
      // Ontario Bar Subjects - Solicitor
      // ============================================
      {
        streamId: ontarioStream.id,
        examTypeId: solicitorExam?.id ?? null,
        title: "Business Law",
        description: "Ontario Bar Solicitor Examination - Business Law",
        thumbnail: "/images/subjects/ontario-business-law.png",
        isActive: true,
        bundle_price: "150.00",
        is_bundle_enabled: true,
      },
      {
        streamId: ontarioStream.id,
        examTypeId: solicitorExam?.id ?? null,
        title: "Estate Planning",
        description: "Ontario Bar Solicitor Examination - Estate Planning",
        thumbnail: "/images/subjects/ontario-estate-planning.png",
        isActive: true,
        bundle_price: "150.00",
        is_bundle_enabled: true,
      },
      {
        streamId: ontarioStream.id,
        examTypeId: solicitorExam?.id ?? null,
        title: "Real Estate Law",
        description: "Ontario Bar Solicitor Examination - Real Estate Law",
        thumbnail: "/images/subjects/ontario-real-estate.png",
        isActive: true,
        bundle_price: "150.00",
        is_bundle_enabled: true,
      },
      {
        streamId: ontarioStream.id,
        examTypeId: solicitorExam?.id ?? null,
        title: "Professional Responsibility (Solicitor)",
        description: "Ontario Bar Solicitor Examination - Professional Responsibility",
        thumbnail: "/images/subjects/ontario-prof-resp-solicitor.png",
        isActive: true,
        bundle_price: "150.00",
        is_bundle_enabled: true,
      },
      // ============================================
      // Ontario Bar Subjects - Barrister
      // ============================================
      {
        streamId: ontarioStream.id,
        examTypeId: barristerExam?.id ?? null,
        title: "Civil Litigation",
        description: "Ontario Bar Barrister Examination - Civil Litigation",
        thumbnail: "/images/subjects/ontario-civil-litigation.png",
        isActive: true,
        bundle_price: "150.00",
        is_bundle_enabled: true,
      },
      {
        streamId: ontarioStream.id,
        examTypeId: barristerExam?.id ?? null,
        title: "Criminal Law (Barrister)",
        description: "Ontario Bar Barrister Examination - Criminal Law",
        thumbnail: "/images/subjects/ontario-criminal-law.png",
        isActive: true,
        bundle_price: "150.00",
        is_bundle_enabled: true,
      },
      {
        streamId: ontarioStream.id,
        examTypeId: barristerExam?.id ?? null,
        title: "Family Law",
        description: "Ontario Bar Barrister Examination - Family Law",
        thumbnail: "/images/subjects/ontario-family-law.png",
        isActive: true,
        bundle_price: "150.00",
        is_bundle_enabled: true,
      },
      {
        streamId: ontarioStream.id,
        examTypeId: barristerExam?.id ?? null,
        title: "Public Law",
        description: "Ontario Bar Barrister Examination - Public Law",
        thumbnail: "/images/subjects/ontario-public-law.png",
        isActive: true,
        bundle_price: "150.00",
        is_bundle_enabled: true,
      },
      {
        streamId: ontarioStream.id,
        examTypeId: barristerExam?.id ?? null,
        title: "Professional Responsibility (Barrister)",
        description: "Ontario Bar Barrister Examination - Professional Responsibility",
        thumbnail: "/images/subjects/ontario-prof-resp-barrister.png",
        isActive: true,
        bundle_price: "150.00",
        is_bundle_enabled: true,
      },
    ];

    await db.insert(schema.subjects)
      .values(subjectsData)
      .onConflictDoNothing();

    const subjects = await db.select().from(schema.subjects);
    console.log("Subjects ready");

    // ==========================
    // Subject Contents (Content Items for Each Subject)
    // ==========================
    console.log("Creating subject content items...");

    if (!videoType || !pdfType || !questionBankType || !iracsType) {
      throw new Error("Content types not found after seeding");
    }

    // Create content items for each subject
    const subjectContentsData = [];

    for (const subject of subjects) {
      // VIDEO content - $150
      subjectContentsData.push({
        subjectId: subject.id,
        contentTypeId: videoType.id,
        title: "Video Lectures",
        description: `Complete video lecture series for ${subject.title}`,
        fileUrl: null,
        price: "150.00",
        sortOrder: 1,
        isActive: true,
      });

      // PDF content - $70
      subjectContentsData.push({
        subjectId: subject.id,
        contentTypeId: pdfType.id,
        title: "Notes",
        description: `Comprehensive study notes for ${subject.title}`,
        fileUrl: null,
        price: "70.00",
        sortOrder: 2,
        isActive: true,
      });

      // Question Bank content - $80
      subjectContentsData.push({
        subjectId: subject.id,
        contentTypeId: questionBankType.id,
        title: "Q&A Set",
        description: `Questions and Answers Set for ${subject.title}`,
        fileUrl: null,
        price: "80.00",
        sortOrder: 3,
        isActive: true,
      });

      // IRACs content - $80
      subjectContentsData.push({
        subjectId: subject.id,
        contentTypeId: iracsType.id,
        title: "IRACs / Essay Answer Structures",
        description: `Essay Answer Structures for ${subject.title}`,
        fileUrl: null,
        price: "80.00",
        sortOrder: 4,
        isActive: true,
      });
    }

    await db.insert(schema.subjectContents)
      .values(subjectContentsData)
      .onConflictDoNothing();

    console.log(`Subject content items ready (${subjectContentsData.length} items created)`);

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

// Run seed if this file is executed directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  seed()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

export default seed;
