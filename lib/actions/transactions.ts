"use server";

import { db, schema } from "@/lib/db";
import { desc, eq, and, or, like, gte, lte, sql } from "drizzle-orm";
import { requireAdmin } from "@/lib/auth/helpers";

export type Transaction = {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  subjectId: string;
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
 * Get all transactions with filters
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

    let query = db
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

    // Apply filters
    const conditions = [];

    if (filters?.search) {
      conditions.push(
        or(
          like(schema.users.name, `%${filters.search}%`),
          like(schema.users.email, `%${filters.search}%`),
          like(schema.subjects.title, `%${filters.search}%`),
          like(schema.purchases.transactionId, `%${filters.search}%`)
        )
      );
    }

    if (filters?.status && filters.status !== "all") {
      conditions.push(eq(schema.purchases.status, filters.status));
    }

    if (filters?.dateFrom) {
      conditions.push(gte(schema.purchases.createdAt, filters.dateFrom));
    }

    if (filters?.dateTo) {
      conditions.push(lte(schema.purchases.createdAt, filters.dateTo));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    // Order by most recent first
    query = query.orderBy(desc(schema.purchases.createdAt));

    // Apply pagination
    if (filters?.limit) {
      query = query.limit(filters.limit);
    }
    if (filters?.offset) {
      query = query.offset(filters.offset);
    }

    const transactions = await query;

    return {
      success: true,
      transactions: transactions as Transaction[],
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
 * Get transaction statistics
 */
export async function getTransactionStats() {
  try {
    await requireAdmin();

    const [stats] = await db
      .select({
        totalRevenue: sql<number>`COALESCE(SUM(CASE WHEN status = 'paid' THEN CAST(amount AS DECIMAL) ELSE 0 END), 0)`,
        totalTransactions: sql<number>`COUNT(*)`,
        pendingAmount: sql<number>`COALESCE(SUM(CASE WHEN status = 'pending' THEN CAST(amount AS DECIMAL) ELSE 0 END), 0)`,
        refundedAmount: sql<number>`COALESCE(SUM(CASE WHEN status = 'refunded' THEN CAST(amount AS DECIMAL) ELSE 0 END), 0)`,
        completedTransactions: sql<number>`COUNT(CASE WHEN status = 'paid' THEN 1 END)`,
        failedTransactions: sql<number>`COUNT(CASE WHEN status = 'failed' THEN 1 END)`,
      })
      .from(schema.purchases);

    return {
      success: true,
      stats: stats as TransactionStats,
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
 * Export transactions to CSV
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
      "User Name",
      "User Email",
      "Subject",
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
      tx.userName,
      tx.userEmail,
      tx.subjectTitle,
      tx.contentTypeName || "N/A",
      tx.isBundle ? "Bundle" : "Individual",
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
