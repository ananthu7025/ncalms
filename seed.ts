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
    // Platform Settings
    // ==========================
    console.log("Creating platform settings...");
    await db.insert(schema.platformSettings)
      .values({
        platformName: "NCA LMS",
        displayName: "NCA Learning Management System",
        paymentCurrency: "CAD",
        timezone: "America/Toronto",
        allSubjectsBundlePrice: "1200.00", // Price for all 5 mandatory NCA subjects
        allSubjectsBundleEnabled: true,
      })
      .onConflictDoNothing();
    console.log("Platform settings ready");

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
        { name: "Video Lectures", description: "Video content" },
        { name: "Notes", description: "PDF learning docs" },
        { name: "Question & Answers", description: "Mock tests & question banks" },
        { name: "IRACs", description: "Essay Answer Structures" },
      ])
      .onConflictDoNothing();

    const contentTypes = await db.select().from(schema.contentTypes);
    const videoType = contentTypes.find(ct => ct.name === "Video Lectures");
    const pdfType = contentTypes.find(ct => ct.name === "Notes");
    const questionBankType = contentTypes.find(ct => ct.name === "Question & Answers");
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
        bundlePrice: "300.00",
        isBundleEnabled: true,
        isMandatory: true,
        isFeatured: true,
        objectives: JSON.stringify([
          "Understand the role, regulation, and ethical framework of the Canadian legal profession",
          "Become familiar with the Federation's Model Code of Professional Conduct",
          "Identify lawyers' professional duties to clients, the court, and the public",
          "Analyse ethical issues arising in different legal practice settings",
          "Apply professional conduct rules to fact-based scenarios",
          "Resolve conflicts between zealous advocacy and ethical obligations",
          "Develop professional judgment in dealing with ethical problems",
          "Think critically about the challenges and responsibilities of legal practice",
          "Prepare candidates to answer NCA ethics questions using Canadian standards"
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
        bundlePrice: "300.00",
        isBundleEnabled: true,
        isMandatory: true,
        isFeatured: true,
        objectives: JSON.stringify([
          "Understand the foundations and purpose of Canadian administrative law",
          "Analyse the powers and limits of administrative decision-makers under statute",
          "Interpret and apply statutory provisions governing administrative action",
          "Understand standards of review and principles of judicial review",
          "Apply procedural fairness and natural justice to factual scenarios",
          "Identify administrative law issues in problem-based questions",
          "Relate legal principles to complex factual situations",
          "Reason toward legally supported outcomes and remedies",
          "Prepare candidates to answer NCA administrative law exams at Canadian lawyer standards"
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
        bundlePrice: "300.00",
        isBundleEnabled: true,
        isMandatory: true,
        isFeatured: true,
        objectives: JSON.stringify([
          "Understand the structure, sources, and supremacy of the Canadian Constitution",
          "Analyse the federal system and the division of powers between Parliament and the provinces",
          "Apply key legislative powers, including POGG, trade and commerce, criminal law, and property and civil rights",
          "Use constitutional doctrines such as pith and substance, paramountcy, and interjurisdictional immunity",
          "Understand Aboriginal and treaty rights under section 35, including the duty to consult",
          "Interpret and apply the Canadian Charter of Rights and Freedoms",
          "Analyse Charter rights including freedom of expression, religion, equality, and section 7",
          "Apply section 1 limits and constitutional remedies under sections 24 and 52",
          "Develop the ability to solve constitutional law problems using Canadian case law and exam methodology"
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
        bundlePrice: "300.00",
        isBundleEnabled: true,
        isMandatory: true,
        isFeatured: true,
        objectives: JSON.stringify([
          "Understand the structure and purpose of Canadian criminal law and the Criminal Code",
          "Identify and apply the elements of criminal offences, including actus reus and mens rea",
          "Analyse leading Canadian criminal law cases and statutory provisions",
          "Distinguish between different categories of offences and standards of fault",
          "Apply criminal law principles to fact-based problem questions",
          "Identify legal issues and select the correct rules of law under the Criminal Code",
          "Explain how criminal law rules operate in real-world factual scenarios",
          "Develop the ability to reason, analyse, and reach legally supported conclusions",
          "Prepare candidates to answer NCA criminal law exam questions at Canadian lawyer standards"
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
        bundlePrice: "300.00",
        isBundleEnabled: true,
        isMandatory: true,
        isFeatured: true,
        objectives: JSON.stringify([
          "Provide NCA applicants with an introduction to and an overview of Canada's legal system and the role of law in Canadian society",
          "Review various legal theories as they apply to Canadian law",
          "Introduce the overarching legal framework within which the particular areas of law studied in other courses operate",
          "Acquaint applicants with the various sources of Canadian law",
          "Compare the different branches of Canadian government and to analyse the relationships between and among them",
          "Provide applicants with an understanding of the Canadian treaty-making process and the implementation of international law into domestic law",
          "Provide applicants with an understanding of the special relationship Aboriginal Peoples have with the Canadian State",
          "Enable applicants to critically assess the impact of the Canadian legal system upon Aboriginal and other minority communities",
          "Provide applicants with an understanding of the nature and function of judicial review and of the basic approaches to statutory interpretation"
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
        bundlePrice: "300.00",
        isBundleEnabled: true,
        isMandatory: false,
        isFeatured: false,
        objectives: JSON.stringify([
          "Understand the legal and constitutional foundations of Canadian property law",
          "Identify and classify different types of proprietary and possessory interests in property",
          "Apply property law doctrines to resolve disputes between competing claimants",
          "Determine priority of rights using common law, equity, and registration systems",
          "Critically assess property law rules in light of fairness, certainty, and public policy"
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
        bundlePrice: "300.00",
        isBundleEnabled: true,
        isMandatory: false,
        isFeatured: false,
        objectives: JSON.stringify([
          "Understand and recall the substantive rules governing the major torts in Canadian law",
          "Identify tort issues and the applicable legal principles in complex fact patterns",
          "Apply tort doctrines to analyse liability, defences, causation, and damages in problem questions",
          "Understand the theoretical bases of tort law, including corrective justice, deterrence, and loss allocation",
          "Critically evaluate tort law outcomes and doctrines using legal theory and policy considerations"
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
        bundlePrice: "300.00",
        isBundleEnabled: true,
        isMandatory: false,
        isFeatured: false,
        objectives: JSON.stringify([
          "Understand the legal characteristics and formation of sole proprietorships, partnerships, and corporations",
          "Explain the rights, duties, and liabilities of owners, partners, directors, and officers",
          "Analyze how business organizations incur obligations to creditors and third parties",
          "Apply corporate governance and fiduciary duty principles to disputes involving management and shareholders",
          "Use statutory and common-law rules to resolve fact-based problems involving business organizations"
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
        bundlePrice: "300.00",
        isBundleEnabled: true,
        isMandatory: false,
        isFeatured: false,
        objectives: JSON.stringify([
          "Understand the core doctrines governing contract formation, performance, breach, and remedies in Canadian law",
          "Identify legally significant issues arising from contractual fact patterns",
          "Apply contract law principles to determine whether enforceable agreements exist and whether they have been breached",
          "Analyze remedies and defences to resolve commercial and private law disputes",
          "Critically evaluate contractual arguments and outcomes using doctrine, policy, and precedent"
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
        bundlePrice: "150.00",
        isBundleEnabled: true,
        isMandatory: false,
        isFeatured: false,
      },
      {
        streamId: ontarioStream.id,
        examTypeId: solicitorExam?.id ?? null,
        title: "Estate Planning",
        description: "Ontario Bar Solicitor Examination - Estate Planning",
        thumbnail: "/images/subjects/ontario-estate-planning.png",
        isActive: true,
        bundlePrice: "150.00",
        isBundleEnabled: true,
        isMandatory: false,
        isFeatured: false,
      },
      {
        streamId: ontarioStream.id,
        examTypeId: solicitorExam?.id ?? null,
        title: "Real Estate Law",
        description: "Ontario Bar Solicitor Examination - Real Estate Law",
        thumbnail: "/images/subjects/ontario-real-estate.png",
        isActive: true,
        bundlePrice: "150.00",
        isBundleEnabled: true,
        isMandatory: false,
        isFeatured: false,
      },
      {
        streamId: ontarioStream.id,
        examTypeId: solicitorExam?.id ?? null,
        title: "Professional Responsibility (Solicitor)",
        description: "Ontario Bar Solicitor Examination - Professional Responsibility",
        thumbnail: "/images/subjects/ontario-prof-resp-solicitor.png",
        isActive: true,
        bundlePrice: "150.00",
        isBundleEnabled: true,
        isMandatory: false,
        isFeatured: false,
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
        bundlePrice: "150.00",
        isBundleEnabled: true,
        isMandatory: false,
        isFeatured: false,
      },
      {
        streamId: ontarioStream.id,
        examTypeId: barristerExam?.id ?? null,
        title: "Criminal Law (Barrister)",
        description: "Ontario Bar Barrister Examination - Criminal Law",
        thumbnail: "/images/subjects/ontario-criminal-law.png",
        isActive: true,
        bundlePrice: "150.00",
        isBundleEnabled: true,
        isMandatory: false,
        isFeatured: false,
      },
      {
        streamId: ontarioStream.id,
        examTypeId: barristerExam?.id ?? null,
        title: "Family Law",
        description: "Ontario Bar Barrister Examination - Family Law",
        thumbnail: "/images/subjects/ontario-family-law.png",
        isActive: true,
        bundlePrice: "150.00",
        isBundleEnabled: true,
        isMandatory: false,
        isFeatured: false,
      },
      {
        streamId: ontarioStream.id,
        examTypeId: barristerExam?.id ?? null,
        title: "Public Law",
        description: "Ontario Bar Barrister Examination - Public Law",
        thumbnail: "/images/subjects/ontario-public-law.png",
        isActive: true,
        bundlePrice: "150.00",
        isBundleEnabled: true,
        isMandatory: false,
        isFeatured: false,
      },
      {
        streamId: ontarioStream.id,
        examTypeId: barristerExam?.id ?? null,
        title: "Professional Responsibility (Barrister)",
        description: "Ontario Bar Barrister Examination - Professional Responsibility",
        thumbnail: "/images/subjects/ontario-prof-resp-barrister.png",
        isActive: true,
        bundlePrice: "150.00",
        isBundleEnabled: true,
        isMandatory: false,
        isFeatured: false,
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
      // VIDEO content
      subjectContentsData.push({
        subjectId: subject.id,
        contentTypeId: videoType.id,
        title: "Video Lectures",
        description: `Complete video lecture series for ${subject.title}`,
        fileUrl: null,
        sortOrder: 1,
        isActive: true,
      });

      // PDF content
      subjectContentsData.push({
        subjectId: subject.id,
        contentTypeId: pdfType.id,
        title: "Notes",
        description: `Comprehensive study notes for ${subject.title}`,
        fileUrl: null,
        sortOrder: 2,
        isActive: true,
      });

      // Question Bank content
      subjectContentsData.push({
        subjectId: subject.id,
        contentTypeId: questionBankType.id,
        title: "Q&A Set",
        description: `Questions and Answers Set for ${subject.title}`,
        fileUrl: null,
        sortOrder: 3,
        isActive: true,
      });

      // IRACs content
      subjectContentsData.push({
        subjectId: subject.id,
        contentTypeId: iracsType.id,
        title: "IRACs / Essay Answer Structures",
        description: `Essay Answer Structures for ${subject.title}`,
        fileUrl: null,
        sortOrder: 4,
        isActive: true,
      });
    }

    await db.insert(schema.subjectContents)
      .values(subjectContentsData)
      .onConflictDoNothing();

    console.log(`Subject content items ready (${subjectContentsData.length} items created)`);

    // ==========================
    // Subject Content Type Pricing
    // ==========================
    console.log("Creating subject content type pricing...");

    const pricingData = [];

    for (const subject of subjects) {
      // VIDEO content - $150
      pricingData.push({
        subjectId: subject.id,
        contentTypeId: videoType.id,
        price: "150.00",
      });

      // PDF content - $70
      pricingData.push({
        subjectId: subject.id,
        contentTypeId: pdfType.id,
        price: "70.00",
      });

      // Question Bank content - $80
      pricingData.push({
        subjectId: subject.id,
        contentTypeId: questionBankType.id,
        price: "80.00",
      });

      // IRACs content - $80
      pricingData.push({
        subjectId: subject.id,
        contentTypeId: iracsType.id,
        price: "80.00",
      });
    }

    await db.insert(schema.subjectContentTypePricing)
      .values(pricingData)
      .onConflictDoNothing();

    console.log(`Subject content type pricing ready (${pricingData.length} pricing entries created)`);

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
