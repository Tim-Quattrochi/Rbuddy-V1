import type { Response } from "express";
import { and, desc, eq, ilike, gte, lte, SQL } from "drizzle-orm";
import type { AuthenticatedRequest } from "../_lib/middleware/auth.js";
import { requireAuth } from "../_lib/middleware/auth.js";
import { db } from "../_lib/storage.js";
import { interactions } from "../../shared/schema.js";
import { createVercelHandler } from "../_lib/vercel-handler.js";

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 50;

function parseLimit(rawLimit: unknown): number {
  if (typeof rawLimit !== "string" || rawLimit.trim().length === 0) {
    return DEFAULT_LIMIT;
  }

  const parsed = Number.parseInt(rawLimit, 10);
  if (Number.isNaN(parsed) || parsed <= 0) {
    return DEFAULT_LIMIT;
  }

  return Math.min(parsed, MAX_LIMIT);
}

function parseOffset(rawOffset: unknown): number {
  if (typeof rawOffset !== "string" || rawOffset.trim().length === 0) {
    return 0;
  }

  const parsed = Number.parseInt(rawOffset, 10);
  if (Number.isNaN(parsed) || parsed < 0) {
    return 0;
  }

  return parsed;
}

function parseSearch(rawSearch: unknown): string | undefined {
  if (typeof rawSearch === "string" && rawSearch.trim().length > 0) {
    return rawSearch.trim();
  }
  return undefined;
}

function parseDate(rawDate: unknown): Date | null {
  if (typeof rawDate !== "string" || rawDate.trim().length === 0) {
    return null;
  }

  const date = new Date(rawDate);
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date;
}

type JournalEntryResponse = {
  id: string;
  body: string;
  createdAt: string;
};

type JournalHistoryResponse = {
  entries: JournalEntryResponse[];
  pagination: {
    limit: number;
    offset: number;
    hasMore: boolean;
    nextOffset: number | null;
  };
};

export async function handler(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const limit = parseLimit(req.query.limit);
    const offset = parseOffset(req.query.offset);
    const search = parseSearch(req.query.search);
    const startDate = parseDate(req.query.startDate);
    const endDate = parseDate(req.query.endDate);

    // Validate date range
    if (startDate && endDate && startDate > endDate) {
      return res.status(400).json({ error: "startDate must be before or equal to endDate" });
    }

    // Build where conditions
    const conditions: SQL[] = [
      eq(interactions.userId, userId),
      eq(interactions.contentType, "journal_entry"),
    ];

    if (search) {
      conditions.push(ilike(interactions.body, `%${search}%`));
    }

    if (startDate) {
      conditions.push(gte(interactions.createdAt, startDate));
    }

    if (endDate) {
      // Include entries created on endDate by adding 1 day
      const endOfDay = new Date(endDate);
      endOfDay.setDate(endOfDay.getDate() + 1);
      conditions.push(lte(interactions.createdAt, endOfDay));
    }

    const rows = await db
      .select({
        id: interactions.id,
        body: interactions.body,
        createdAt: interactions.createdAt,
      })
      .from(interactions)
      .where(and(...conditions))
      .orderBy(desc(interactions.createdAt))
      .limit(limit + 1)
      .offset(offset);

    const hasMore = rows.length > limit;
    const entries = rows.slice(0, limit).map<JournalEntryResponse>((entry) => ({
      id: entry.id,
      body: entry.body,
      createdAt: (entry.createdAt ?? new Date(0)).toISOString(),
    }));

    const payload: JournalHistoryResponse = {
      entries,
      pagination: {
        limit,
        offset,
        hasMore,
        nextOffset: hasMore ? offset + limit : null,
      },
    };

    return res.status(200).json(payload);
  } catch (error) {
    console.error("[JournalHistory] Failed to fetch journal history", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

// Export for Express server (middleware array)
export const middlewares = [requireAuth, handler];

// Export for Vercel serverless (wrapped function)
export default createVercelHandler(middlewares);