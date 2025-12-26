import { Resend } from "resend";
import { db, schema } from "@/lib/db";
import { eq } from "drizzle-orm";

const resend = new Resend(process.env.RESEND_API_KEY!);

type EmailData = {
    to: string;
    templateName: string;
    dynamicData: Record<string, string>;
};

export async function sendEmail({ to, templateName, dynamicData }: EmailData) {
    try {
        // 1. Fetch template from DB
        const [template] = await db
            .select()
            .from(schema.emailTemplates)
            .where(eq(schema.emailTemplates.name, templateName))
            .limit(1);

        if (!template) {
            console.error(`Email template '${templateName}' not found.`);
            return { success: false, error: "Template not found" };
        }

        // 2. Process template content
        let htmlContent = template.htmlContent;
        let textContent = template.textContent;
        let subject = template.subject;

        // Replace placeholders with dynamic data
        Object.entries(dynamicData).forEach(([key, value]) => {
            const placeholder = `{{${key}}}`;
            // Global replace for all occurrences
            htmlContent = htmlContent.replace(new RegExp(placeholder, 'g'), value);
            textContent = textContent.replace(new RegExp(placeholder, 'g'), value);
            subject = subject.replace(new RegExp(placeholder, 'g'), value); // Subject might have placeholders too
        });

        // 3. Send email using Resend
        const data = await resend.emails.send({
            from: "NCA LMS <onboarding@resend.dev>", // Replace with verified domain in production
            to: [to],
            subject: subject,
            html: htmlContent,
            text: textContent,
        });

        if (data.error) {
            console.error("Resend API error:", data.error);
            return { success: false, error: data.error.message };
        }

        return { success: true, message: "Email sent successfully", id: data.data?.id };
    } catch (error) {
        console.error("Send email exception:", error);
        return { success: false, error: "Failed to send email" };
    }
}
