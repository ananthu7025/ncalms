"use server";

import { db } from "@/lib/db";
import { supportTickets, supportTicketMessages, users } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { getSession } from "@/lib/auth/helpers";
import { revalidatePath } from "next/cache";

// Types
export type TicketCategory = "issue" | "question" | "feedback" | "refund";
export type TicketStatus = "new" | "pending" | "resolved";

export interface TicketWithDetails {
  id: string;
  subject: string;
  category: TicketCategory;
  status: TicketStatus;
  createdAt: Date;
  updatedAt: Date;
  user: {
    name: string;
    email: string;
  };
  messages: {
    id: string;
    message: string;
    isFromAdmin: boolean;
    createdAt: Date;
    userName?: string;
  }[];
  isUnread?: boolean;
}

// Learner Actions
export async function createSupportTicket(data: {
  subject: string;
  category: TicketCategory;
  message: string;
}) {
  try {
    const session = await getSession();
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    // Create the ticket
    const [ticket] = await db
      .insert(supportTickets)
      .values({
        userId: session.user.id,
        subject: data.subject,
        category: data.category,
        status: "new",
      })
      .returning();

    // Add the initial message
    await db.insert(supportTicketMessages).values({
      ticketId: ticket.id,
      userId: session.user.id,
      message: data.message,
      isFromAdmin: false,
    });

    revalidatePath("/learner/support");
    return { success: true, ticketId: ticket.id };
  } catch (error) {
    console.error("Error creating support ticket:", error);
    return { success: false, error: "Failed to create support ticket" };
  }
}

export async function getLearnerTickets() {
  try {
    const session = await getSession();
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    const tickets = await db.query.supportTickets.findMany({
      where: eq(supportTickets.userId, session.user.id),
      orderBy: [desc(supportTickets.updatedAt)],
      with: {
        user: {
          columns: {
            name: true,
            email: true,
          },
        },
        messages: {
          orderBy: [desc(supportTicketMessages.createdAt)],
          with: {
            user: {
              columns: {
                name: true,
              },
            },
          },
        },
      },
    });

    const formattedTickets: TicketWithDetails[] = tickets.map((ticket) => ({
      id: ticket.id,
      subject: ticket.subject,
      category: ticket.category as TicketCategory,
      status: ticket.status as TicketStatus,
      createdAt: ticket.createdAt,
      updatedAt: ticket.updatedAt,
      user: ticket.user,
      messages: ticket.messages.map((msg) => ({
        id: msg.id,
        message: msg.message,
        isFromAdmin: msg.isFromAdmin,
        createdAt: msg.createdAt,
        userName: msg.user?.name,
      })),
    }));

    return { success: true, tickets: formattedTickets };
  } catch (error) {
    console.error("Error fetching learner tickets:", error);
    return { success: false, error: "Failed to fetch tickets" };
  }
}

export async function addTicketMessage(ticketId: string, message: string) {
  try {
    const session = await getSession();
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    // Verify ticket belongs to user
    const ticket = await db.query.supportTickets.findFirst({
      where: eq(supportTickets.id, ticketId),
    });

    if (!ticket || ticket.userId !== session.user.id) {
      return { success: false, error: "Ticket not found" };
    }

    // Add message
    await db.insert(supportTicketMessages).values({
      ticketId,
      userId: session.user.id,
      message,
      isFromAdmin: false,
    });

    // Update ticket status to pending if it was resolved
    if (ticket.status === "resolved") {
      await db
        .update(supportTickets)
        .set({
          status: "pending",
          updatedAt: new Date(),
        })
        .where(eq(supportTickets.id, ticketId));
    } else {
      // Just update the timestamp
      await db
        .update(supportTickets)
        .set({ updatedAt: new Date() })
        .where(eq(supportTickets.id, ticketId));
    }

    revalidatePath("/learner/support");
    return { success: true };
  } catch (error) {
    console.error("Error adding ticket message:", error);
    return { success: false, error: "Failed to add message" };
  }
}

// Admin Actions
export async function getAllSupportTickets(filters?: {
  status?: TicketStatus | "all";
  category?: TicketCategory | "all";
  searchQuery?: string;
}) {
  try {
    const session = await getSession();
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return { success: false, error: "Unauthorized" };
    }

    const tickets = await db.query.supportTickets.findMany({
      orderBy: [desc(supportTickets.updatedAt)],
      with: {
        user: {
          columns: {
            name: true,
            email: true,
          },
        },
        messages: {
          orderBy: [desc(supportTicketMessages.createdAt)],
          with: {
            user: {
              columns: {
                name: true,
              },
            },
          },
        },
      },
    });

    // Apply filters
    let filteredTickets = tickets;

    if (filters?.status && filters.status !== "all") {
      filteredTickets = filteredTickets.filter(
        (t) => t.status === filters.status
      );
    }

    if (filters?.category && filters.category !== "all") {
      filteredTickets = filteredTickets.filter(
        (t) => t.category === filters.category
      );
    }

    if (filters?.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filteredTickets = filteredTickets.filter(
        (t) =>
          t.subject.toLowerCase().includes(query) ||
          t.user.name.toLowerCase().includes(query) ||
          t.user.email.toLowerCase().includes(query)
      );
    }

    const formattedTickets: TicketWithDetails[] = filteredTickets.map(
      (ticket) => ({
        id: ticket.id,
        subject: ticket.subject,
        category: ticket.category as TicketCategory,
        status: ticket.status as TicketStatus,
        createdAt: ticket.createdAt,
        updatedAt: ticket.updatedAt,
        user: ticket.user,
        messages: ticket.messages.map((msg) => ({
          id: msg.id,
          message: msg.message,
          isFromAdmin: msg.isFromAdmin,
          createdAt: msg.createdAt,
          userName: msg.user?.name,
        })),
        isUnread: ticket.status === "new",
      })
    );

    return { success: true, tickets: formattedTickets };
  } catch (error) {
    console.error("Error fetching support tickets:", error);
    return { success: false, error: "Failed to fetch tickets" };
  }
}

export async function replyToTicket(ticketId: string, message: string) {
  try {
    const session = await getSession();
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return { success: false, error: "Unauthorized" };
    }

    // Add admin reply
    await db.insert(supportTicketMessages).values({
      ticketId,
      userId: session.user.id,
      message,
      isFromAdmin: true,
    });

    // Update ticket status to pending
    await db
      .update(supportTickets)
      .set({
        status: "pending",
        updatedAt: new Date(),
      })
      .where(eq(supportTickets.id, ticketId));

    revalidatePath("/admin/support");
    return { success: true };
  } catch (error) {
    console.error("Error replying to ticket:", error);
    return { success: false, error: "Failed to send reply" };
  }
}

export async function updateTicketStatus(
  ticketId: string,
  status: TicketStatus
) {
  try {
    const session = await getSession();
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return { success: false, error: "Unauthorized" };
    }

    await db
      .update(supportTickets)
      .set({
        status,
        updatedAt: new Date(),
      })
      .where(eq(supportTickets.id, ticketId));

    revalidatePath("/admin/support");
    return { success: true };
  } catch (error) {
    console.error("Error updating ticket status:", error);
    return { success: false, error: "Failed to update ticket status" };
  }
}

export async function getSupportStats() {
  try {
    const session = await getSession();
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return { success: false, error: "Unauthorized" };
    }

    const allTickets = await db.query.supportTickets.findMany();

    const stats = {
      new: allTickets.filter((t) => t.status === "new").length,
      pending: allTickets.filter((t) => t.status === "pending").length,
      resolved: allTickets.filter((t) => t.status === "resolved").length,
      total: allTickets.length,
    };

    return { success: true, stats };
  } catch (error) {
    console.error("Error fetching support stats:", error);
    return { success: false, error: "Failed to fetch stats" };
  }
}

// Public Contact Form - for unauthenticated users
export async function createPublicContactTicket(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
  category?: TicketCategory;
}) {
  try {
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return { success: false, error: "Invalid email address" };
    }

    // Check if user exists
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, data.email.toLowerCase()),
    });

    let userId: string;

    if (existingUser) {
      userId = existingUser.id;
    } else {
      // Find learner role for new contact form users
      const learnerRole = await db.query.roles.findFirst({
        columns: { id: true },
      });

      if (!learnerRole) {
        return { success: false, error: "System configuration error" };
      }

      // Create a guest user for contact form submissions
      const [newUser] = await db
        .insert(users)
        .values({
          name: data.name,
          email: data.email.toLowerCase(),
          passwordHash: "__CONTACT_FORM_USER__", // Special marker for contact form users
          roleId: learnerRole.id,
          isActive: false, // Mark as inactive - they're just contact submissions
        })
        .onConflictDoNothing()
        .returning();

      if (newUser) {
        userId = newUser.id;
      } else {
        // User was created due to conflict, fetch them
        const user = await db.query.users.findFirst({
          where: eq(users.email, data.email.toLowerCase()),
        });
        if (user) {
          userId = user.id;
        } else {
          return { success: false, error: "Failed to process contact request" };
        }
      }
    }

    // Create the support ticket
    const [ticket] = await db
      .insert(supportTickets)
      .values({
        userId,
        subject: data.subject,
        category: data.category || "question",
        status: "new",
      })
      .returning();

    // Add the initial message
    await db.insert(supportTicketMessages).values({
      ticketId: ticket.id,
      userId,
      message: data.message,
      isFromAdmin: false,
    });

    return { success: true, ticketId: ticket.id };
  } catch (error) {
    console.error("Error creating public contact ticket:", error);
    return { success: false, error: "Failed to submit contact form" };
  }
}
