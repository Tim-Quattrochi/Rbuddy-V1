import dotenv from "dotenv";
dotenv.config();

import type { Response } from "express";
import { and, desc, eq } from "drizzle-orm";
import type { AuthenticatedRequest } from "../../server/middleware/auth";
import { requireAuth } from "../../server/middleware/auth";
import { db } from "../../server/storage";
import { interactions } from "../../shared/schema";

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

    const rows = await db
      .select({
        id: interactions.id,
        body: interactions.body,
        createdAt: interactions.createdAt,
      })
      .from(interactions)
      .where(
        and(
          eq(interactions.userId, userId),
          eq(interactions.contentType, "journal_entry"),
        ),
      )
      .orderBy(desc(interactions.createdAt))
      .limit(limit + 1)
      .offset(offset);

    const hasMore = rows.length > limit;
    const entries = rows.slice(0, limit).map<JournalEntryResponse>((entry) => ({
      id: entry.id,
      body: entry.body,
      createdAt: entry.createdAt ? entry.createdAt.toISOString() : new Date().toISOString(),
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

export default [requireAuth, handler];