"use server";

import { db, schema } from "@/lib/db";
import { desc, eq, and, or, like, gte, lte, sql } from "drizzle-orm";
import { requireAdmin } from "@/lib/auth/helpers";

export type Transaction = {
  id: string;
  type: 'course' | 'session';
  userId: string;
  userName: string;
  userEmail: string;
  subjectId?: string;
  subjectTitle: string;
  contentTypeId: string | null;
  contentTypeName: string | null;
  isBundle: boolean;
  amount: string;
  status: string;
  transactionId: string | null;
  stripeSessionId: string | null;
  stripePaymentIntentId: string | null;
  createdAt: Date;
};

export type TransactionStats = {
  totalRevenue: number;
  totalTransactions: number;
  pendingAmount: number;
  refundedAmount: number;
  completedTransactions: number;
  failedTransactions: number;
};

/**
 * Get all transactions with filters (includes both course purchases and session bookings)
 */
export async function getTransactions(filters?: {
  search?: string;
  status?: string;
  dateFrom?: Date;
  dateTo?: Date;
  limit?: number;
  offset?: number;
}) {
  try {
    await requireAdmin();

    // Fetch course purchases
    const purchaseConditions = [];
    if (filters?.status && filters.status !== "all") {
      purchaseConditions.push(eq(schema.purchases.status, filters.status));
    }
    if (filters?.dateFrom) {
      purchaseConditions.push(gte(schema.purchases.createdAt, filters.dateFrom));
    }
    if (filters?.dateTo) {
      purchaseConditions.push(lte(schema.purchases.createdAt, filters.dateTo));
    }

    let purchasesQuery = db
      .select({
        id: schema.purchases.id,
        userId: schema.purchases.userId,
        userName: schema.users.name,
        userEmail: schema.users.email,
        subjectId: schema.purchases.subjectId,
        subjectTitle: schema.subjects.title,
        contentTypeId: schema.purchases.contentTypeId,
        contentTypeName: schema.contentTypes.name,
        isBundle: schema.purchases.isBundle,
        amount: schema.purchases.amount,
        status: schema.purchases.status,
        transactionId: schema.purchases.transactionId,
        stripeSessionId: schema.purchases.stripeSessionId,
        stripePaymentIntentId: schema.purchases.stripePaymentIntentId,
        createdAt: schema.purchases.createdAt,
      })
      .from(schema.purchases)
      .innerJoin(schema.users, eq(schema.purchases.userId, schema.users.id))
      .innerJoin(schema.subjects, eq(schema.purchases.subjectId, schema.subjects.id))
      .leftJoin(schema.contentTypes, eq(schema.purchases.contentTypeId, schema.contentTypes.id))
      .$dynamic();

    if (purchaseConditions.length > 0) {
      purchasesQuery = purchasesQuery.where(and(...purchaseConditions));
    }

    const purchases = await purchasesQuery;

    // Fetch session bookings
    const bookingConditions = [];
    if (filters?.status && filters.status !== "all") {
      // Map status names: paid -> confirmed for sessions
      const sessionStatus = filters.status === 'paid' ? 'confirmed' : filters.status;
      bookingConditions.push(eq(schema.sessionBookings.status, sessionStatus));
    }
    if (filters?.dateFrom) {
      bookingConditions.push(gte(schema.sessionBookings.createdAt, filters.dateFrom));
    }
    if (filters?.dateTo) {
      bookingConditions.push(lte(schema.sessionBookings.createdAt, filters.dateTo));
    }

    let bookingsQuery = db
      .select({
        id: schema.sessionBookings.id,
        userId: schema.sessionBookings.userId,
        userName: schema.users.name,
        userEmail: schema.users.email,
        sessionTitle: schema.sessionTypes.title,
        amount: schema.sessionBookings.amountPaid,
        status: schema.sessionBookings.status,
        stripeSessionId: schema.sessionBookings.stripeSessionId,
        stripePurchaseId: schema.sessionBookings.stripePurchaseId,
        createdAt: schema.sessionBookings.createdAt,
      })
      .from(schema.sessionBookings)
      .innerJoin(schema.users, eq(schema.sessionBookings.userId, schema.users.id))
      .innerJoin(schema.sessionTypes, eq(schema.sessionBookings.sessionTypeId, schema.sessionTypes.id))
      .$dynamic();

    if (bookingConditions.length > 0) {
      bookingsQuery = bookingsQuery.where(and(...bookingConditions));
    }

    const bookings = await bookingsQuery;

    // Transform and combine both types
    const coursePurchases: Transaction[] = purchases.map(p => ({
      id: p.id,
      type: 'course' as const,
      userId: p.userId,
      userName: p.userName,
      userEmail: p.userEmail,
      subjectId: p.subjectId,
      subjectTitle: p.subjectTitle,
      contentTypeId: p.contentTypeId,
      contentTypeName: p.contentTypeName,
      isBundle: p.isBundle,
      amount: p.amount,
      status: p.status,
      transactionId: p.transactionId,
      stripeSessionId: p.stripeSessionId,
      stripePaymentIntentId: p.stripePaymentIntentId,
      createdAt: p.createdAt,
    }));

    const sessionTransactions: Transaction[] = bookings.map(b => ({
      id: b.id,
      type: 'session' as const,
      userId: b.userId,
      userName: b.userName,
      userEmail: b.userEmail,
      subjectTitle: b.sessionTitle,
      contentTypeId: null,
      contentTypeName: 'Session Booking',
      isBundle: false,
      amount: b.amount || '0',
      status: b.status === 'confirmed' ? 'paid' : b.status, // Map confirmed to paid for consistency
      transactionId: null,
      stripeSessionId: b.stripeSessionId,
      stripePaymentIntentId: b.stripePurchaseId,
      createdAt: b.createdAt,
    }));

    // Combine and sort by date
    let allTransactions = [...coursePurchases, ...sessionTransactions];

    // Apply search filter
    if (filters?.search) {
      const searchLower = filters.search.toLowerCase();
      allTransactions = allTransactions.filter(tx =>
        tx.userName.toLowerCase().includes(searchLower) ||
        tx.userEmail.toLowerCase().includes(searchLower) ||
        tx.subjectTitle.toLowerCase().includes(searchLower) ||
        tx.id.toLowerCase().includes(searchLower) ||
        (tx.transactionId && tx.transactionId.toLowerCase().includes(searchLower))
      );
    }

    // Sort by most recent first
    allTransactions.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    // Apply pagination
    if (filters?.limit || filters?.offset) {
      const start = filters?.offset || 0;
      const end = start + (filters?.limit || allTransactions.length);
      allTransactions = allTransactions.slice(start, end);
    }

    return {
      success: true,
      transactions: allTransactions,
    };
  } catch (error) {
    console.error("Get transactions error:", error);
    return {
      success: false,
      error: "Failed to fetch transactions",
      transactions: [],
    };
  }
}

/**
 * Get transaction statistics (includes both purchases and session bookings)
 */
export async function getTransactionStats() {
  try {
    await requireAdmin();

    // Get purchase stats
    const [purchaseStats] = await db
      .select({
        totalRevenue: sql<number>`COALESCE(SUM(CASE WHEN status = 'paid' THEN CAST(amount AS DECIMAL) ELSE 0 END), 0)`,
        totalTransactions: sql<number>`COUNT(*)`,
        pendingAmount: sql<number>`COALESCE(SUM(CASE WHEN status = 'pending' THEN CAST(amount AS DECIMAL) ELSE 0 END), 0)`,
        refundedAmount: sql<number>`COALESCE(SUM(CASE WHEN status = 'refunded' THEN CAST(amount AS DECIMAL) ELSE 0 END), 0)`,
        completedTransactions: sql<number>`COUNT(CASE WHEN status = 'paid' THEN 1 END)`,
        failedTransactions: sql<number>`COUNT(CASE WHEN status = 'failed' THEN 1 END)`,
      })
      .from(schema.purchases);

    // Get session booking stats
    const [sessionStats] = await db
      .select({
        totalRevenue: sql<number>`COALESCE(SUM(CASE WHEN status = 'confirmed' AND amount_paid IS NOT NULL THEN CAST(amount_paid AS DECIMAL) ELSE 0 END), 0)`,
        totalTransactions: sql<number>`COUNT(*)`,
        pendingAmount: sql<number>`COALESCE(SUM(CASE WHEN status = 'pending' AND amount_paid IS NULL THEN 0 ELSE 0 END), 0)`,
        refundedAmount: sql<number>`COALESCE(SUM(CASE WHEN status = 'cancelled' AND amount_paid IS NOT NULL THEN CAST(amount_paid AS DECIMAL) ELSE 0 END), 0)`,
        completedTransactions: sql<number>`COUNT(CASE WHEN status = 'confirmed' THEN 1 END)`,
        failedTransactions: sql<number>`COUNT(CASE WHEN status = 'cancelled' THEN 1 END)`,
      })
      .from(schema.sessionBookings);

    // Combine stats
    const combinedStats = {
      totalRevenue: (purchaseStats.totalRevenue || 0) + (sessionStats.totalRevenue || 0),
      totalTransactions: (purchaseStats.totalTransactions || 0) + (sessionStats.totalTransactions || 0),
      pendingAmount: (purchaseStats.pendingAmount || 0) + (sessionStats.pendingAmount || 0),
      refundedAmount: (purchaseStats.refundedAmount || 0) + (sessionStats.refundedAmount || 0),
      completedTransactions: (purchaseStats.completedTransactions || 0) + (sessionStats.completedTransactions || 0),
      failedTransactions: (purchaseStats.failedTransactions || 0) + (sessionStats.failedTransactions || 0),
    };

    return {
      success: true,
      stats: combinedStats as TransactionStats,
    };
  } catch (error) {
    console.error("Get transaction stats error:", error);
    return {
      success: false,
      error: "Failed to fetch statistics",
      stats: {
        totalRevenue: 0,
        totalTransactions: 0,
        pendingAmount: 0,
        refundedAmount: 0,
        completedTransactions: 0,
        failedTransactions: 0,
      },
    };
  }
}

/**
 * Get single transaction details
 */
export async function getTransactionById(id: string) {
  try {
    await requireAdmin();

    const [transaction] = await db
      .select({
        id: schema.purchases.id,
        userId: schema.purchases.userId,
        userName: schema.users.name,
        userEmail: schema.users.email,
        subjectId: schema.purchases.subjectId,
        subjectTitle: schema.subjects.title,
        contentTypeId: schema.purchases.contentTypeId,
        contentTypeName: schema.contentTypes.name,
        isBundle: schema.purchases.isBundle,
        amount: schema.purchases.amount,
        status: schema.purchases.status,
        transactionId: schema.purchases.transactionId,
        stripeSessionId: schema.purchases.stripeSessionId,
        stripePaymentIntentId: schema.purchases.stripePaymentIntentId,
        createdAt: schema.purchases.createdAt,
      })
      .from(schema.purchases)
      .innerJoin(schema.users, eq(schema.purchases.userId, schema.users.id))
      .innerJoin(schema.subjects, eq(schema.purchases.subjectId, schema.subjects.id))
      .leftJoin(schema.contentTypes, eq(schema.purchases.contentTypeId, schema.contentTypes.id))
      .where(eq(schema.purchases.id, id))
      .limit(1);

    if (!transaction) {
      return {
        success: false,
        error: "Transaction not found",
      };
    }

    return {
      success: true,
      transaction: transaction as Transaction,
    };
  } catch (error) {
    console.error("Get transaction error:", error);
    return {
      success: false,
      error: "Failed to fetch transaction",
    };
  }
}

/**
 * Export transactions to CSV (includes both purchases and session bookings)
 */
export async function exportTransactionsToCSV(filters?: {
  search?: string;
  status?: string;
  dateFrom?: Date;
  dateTo?: Date;
}) {
  try {
    await requireAdmin();

    const result = await getTransactions(filters);

    if (!result.success || !result.transactions) {
      return {
        success: false,
        error: "Failed to fetch transactions for export",
      };
    }

    // Create CSV header
    const headers = [
      "Transaction ID",
      "Date",
      "Category",
      "User Name",
      "User Email",
      "Item",
      "Content Type",
      "Type",
      "Amount",
      "Status",
      "Stripe Session ID",
      "Stripe Payment Intent ID",
    ];

    // Create CSV rows
    const rows = result.transactions.map((tx) => [
      tx.id,
      tx.createdAt.toISOString(),
      tx.type === 'session' ? 'Session Booking' : 'Course Purchase',
      tx.userName,
      tx.userEmail,
      tx.subjectTitle,
      tx.contentTypeName || "N/A",
      tx.type === 'session' ? 'Booking' : (tx.isBundle ? "Bundle" : "Individual"),
      tx.amount,
      tx.status,
      tx.stripeSessionId || "N/A",
      tx.stripePaymentIntentId || "N/A",
    ]);

    // Combine headers and rows
    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    return {
      success: true,
      csv: csvContent,
    };
  } catch (error) {
    console.error("Export transactions error:", error);
    return {
      success: false,
      error: "Failed to export transactions",
    };
  }
}
