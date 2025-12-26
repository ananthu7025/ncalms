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

/**
 * Send session booking confirmation email
 */
type BookingConfirmationData = {
    email: string;
    fullName: string;
    sessionTitle: string;
    sessionDuration: number;
    sessionPrice: string;
    bookingId: string;
};

export async function sendBookingConfirmationEmail(data: BookingConfirmationData) {
    try {
        // Try to use DB template first, fallback to hardcoded template if not found
        const result = await sendEmail({
            to: data.email,
            templateName: "BOOKING_CONFIRMATION",
            dynamicData: {
                fullName: data.fullName,
                sessionTitle: data.sessionTitle,
                sessionDuration: data.sessionDuration.toString(),
                sessionPrice: data.sessionPrice,
                bookingId: data.bookingId,
            },
        });

        // If template not found, send with hardcoded template
        if (!result.success && result.error === "Template not found") {
            const emailData = await resend.emails.send({
                from: "NCA LMS <onboarding@resend.dev>",
                to: [data.email],
                subject: `Booking Confirmed - ${data.sessionTitle}`,
                html: `
                    <h2>Session Booking Confirmed</h2>
                    <p>Dear ${data.fullName},</p>
                    <p>Your session booking has been confirmed!</p>
                    <h3>Booking Details:</h3>
                    <ul>
                        <li><strong>Session:</strong> ${data.sessionTitle}</li>
                        <li><strong>Duration:</strong> ${data.sessionDuration} minutes</li>
                        <li><strong>Amount Paid:</strong> $${data.sessionPrice} CAD</li>
                        <li><strong>Booking ID:</strong> ${data.bookingId}</li>
                    </ul>
                    <p>We will contact you shortly via your provided contact details to schedule your session.</p>
                    <p>Thank you for choosing NCA LMS!</p>
                    <p>Best regards,<br>The NCA LMS Team</p>
                `,
                text: `
Session Booking Confirmed

Dear ${data.fullName},

Your session booking has been confirmed!

Booking Details:
- Session: ${data.sessionTitle}
- Duration: ${data.sessionDuration} minutes
- Amount Paid: $${data.sessionPrice} CAD
- Booking ID: ${data.bookingId}

We will contact you shortly via your provided contact details to schedule your session.

Thank you for choosing NCA LMS!

Best regards,
The NCA LMS Team
                `.trim(),
            });

            if (emailData.error) {
                console.error("Error sending booking confirmation email:", emailData.error);
                return { success: false, error: emailData.error.message };
            }

            return { success: true, message: "Booking confirmation email sent" };
        }

        return result;
    } catch (error) {
        console.error("Error sending booking confirmation email:", error);
        return { success: false, error: "Failed to send booking confirmation email" };
    }
}

/**
 * Send session booking cancellation email
 */
type BookingCancellationData = {
    email: string;
    fullName: string;
    sessionTitle: string;
    bookingId: string;
};

export async function sendBookingCancellationEmail(data: BookingCancellationData) {
    try {
        // Try to use DB template first, fallback to hardcoded template if not found
        const result = await sendEmail({
            to: data.email,
            templateName: "BOOKING_CANCELLATION",
            dynamicData: {
                fullName: data.fullName,
                sessionTitle: data.sessionTitle,
                bookingId: data.bookingId,
            },
        });

        // If template not found, send with hardcoded template
        if (!result.success && result.error === "Template not found") {
            const emailData = await resend.emails.send({
                from: "NCA LMS <onboarding@resend.dev>",
                to: [data.email],
                subject: `Booking Cancelled - ${data.sessionTitle}`,
                html: `
                    <h2>Session Booking Cancelled</h2>
                    <p>Dear ${data.fullName},</p>
                    <p>Your session booking has been cancelled.</p>
                    <h3>Cancelled Booking Details:</h3>
                    <ul>
                        <li><strong>Session:</strong> ${data.sessionTitle}</li>
                        <li><strong>Booking ID:</strong> ${data.bookingId}</li>
                    </ul>
                    <p>If you have already made a payment, a refund will be processed within 5-10 business days.</p>
                    <p>If you have any questions, please contact our support team.</p>
                    <p>Thank you for your understanding.</p>
                    <p>Best regards,<br>The NCA LMS Team</p>
                `,
                text: `
Session Booking Cancelled

Dear ${data.fullName},

Your session booking has been cancelled.

Cancelled Booking Details:
- Session: ${data.sessionTitle}
- Booking ID: ${data.bookingId}

If you have already made a payment, a refund will be processed within 5-10 business days.

If you have any questions, please contact our support team.

Thank you for your understanding.

Best regards,
The NCA LMS Team
                `.trim(),
            });

            if (emailData.error) {
                console.error("Error sending booking cancellation email:", emailData.error);
                return { success: false, error: emailData.error.message };
            }

            return { success: true, message: "Booking cancellation email sent" };
        }

        return result;
    } catch (error) {
        console.error("Error sending booking cancellation email:", error);
        return { success: false, error: "Failed to send booking cancellation email" };
    }
}
