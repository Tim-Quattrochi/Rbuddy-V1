import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Mock } from "vitest";
import { middlewares as historyHandler, handler } from "./history";

vi.mock("../_lib/middleware/auth", () => ({
  requireAuth: (req: any, _res: any, next: () => void) => {
    req.userId = req.userId ?? "user-123";
    next();
  },
}));

type DbMocks = {
  select: Mock;
  offset: Mock;
  limit: Mock;
  orderBy: Mock;
  where: Mock;
  from: Mock;
};

vi.mock("../_lib/storage", () => {
  const builder: Record<string, any> = {};
  const offset = vi.fn(async () => [] as any[]);
  const limit = vi.fn(() => builder);
  const orderBy = vi.fn(() => builder);
  const where = vi.fn(() => builder);
  const from = vi.fn(() => builder);
  const select = vi.fn(() => builder);

  Object.assign(builder, {
    from,
    where,
    orderBy,
    limit,
    offset,
  });

  const key = Symbol.for("test.db.mocks");
  (globalThis as any)[key] = { select, offset, limit, orderBy, where, from } satisfies DbMocks;

  return {
    db: {
      select,
    },
  };
});

function getDbMocks(): DbMocks {
  const key = Symbol.for("test.db.mocks");
  const mocks = (globalThis as any)[key] as DbMocks | undefined;
  if (!mocks) {
    throw new Error("DB mocks not initialized");
  }
  return mocks;
}

function createMockReq(query: Record<string, unknown> = {}, userId: string | undefined = "user-123") {
  return {
    method: "GET",
    query,
    userId,
    headers: {
      "content-type": "application/json",
    },
  } as any;
}

function createMockRes() {
  const res: any = {};
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res;
}

async function runMiddlewares(middlewares: any, req: any, res: any) {
  for (const middleware of middlewares) {
    let nextCalled = false;
    await middleware(req, res, (err?: unknown) => {
      if (err) throw err;
      nextCalled = true;
    });
    if (!nextCalled) {
      break;
    }
  }
}

describe("GET /api/journal/history", () => {
  let mocks: DbMocks;

  beforeEach(() => {
    vi.clearAllMocks();
    mocks = getDbMocks();
    mocks.offset.mockImplementation(async () => [] as any[]);
  });

  it("returns journal entries with pagination metadata", async () => {
    const now = new Date();
    mocks.offset.mockResolvedValueOnce([
      { id: "entry-2", body: "Second entry", createdAt: now },
      { id: "entry-1", body: "First entry", createdAt: new Date(now.getTime() - 1000) },
      { id: "entry-0", body: "Extra entry", createdAt: new Date(now.getTime() - 2000) },
    ]);

    const req = createMockReq({ limit: "2", offset: "0" });
    const res = createMockRes();

    await runMiddlewares(historyHandler, req, res);

  expect(mocks.select).toHaveBeenCalledTimes(1);
  expect(mocks.limit).toHaveBeenCalledWith(3); // limit + 1 for hasMore check
  expect(mocks.offset).toHaveBeenCalledWith(0);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        entries: expect.arrayContaining([
          expect.objectContaining({ id: "entry-2", body: "Second entry" }),
          expect.objectContaining({ id: "entry-1", body: "First entry" }),
        ]),
        pagination: expect.objectContaining({
          hasMore: true,
          nextOffset: 2,
          limit: 2,
          offset: 0,
        }),
      }),
    );
  });

  it("returns 401 when user is missing", async () => {
    const req = createMockReq();
    delete req.userId;
    const res = createMockRes();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: "Unauthorized" });
  });

  it("handles database errors gracefully", async () => {
    mocks.offset.mockRejectedValueOnce(new Error("db failure"));

    const req = createMockReq();
    const res = createMockRes();

    await runMiddlewares(historyHandler, req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Internal Server Error" });
  });

  it("filters entries by search keyword", async () => {
    const now = new Date();
    mocks.offset.mockResolvedValueOnce([
      { id: "entry-1", body: "Feeling grateful today", createdAt: now },
    ]);

    const req = createMockReq({ search: "grateful", limit: "20" });
    const res = createMockRes();

    await runMiddlewares(historyHandler, req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        entries: expect.arrayContaining([
          expect.objectContaining({ id: "entry-1", body: "Feeling grateful today" }),
        ]),
      }),
    );
  });

  it("filters entries by startDate", async () => {
    const targetDate = new Date("2025-10-01");
    mocks.offset.mockResolvedValueOnce([
      { id: "entry-1", body: "Recent entry", createdAt: targetDate },
    ]);

    const req = createMockReq({ startDate: "2025-10-01" });
    const res = createMockRes();

    await runMiddlewares(historyHandler, req, res);

    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("filters entries by endDate", async () => {
    const targetDate = new Date("2025-10-10");
    mocks.offset.mockResolvedValueOnce([
      { id: "entry-1", body: "Old entry", createdAt: targetDate },
    ]);

    const req = createMockReq({ endDate: "2025-10-10" });
    const res = createMockRes();

    await runMiddlewares(historyHandler, req, res);

    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("filters entries by date range", async () => {
    const targetDate = new Date("2025-10-05");
    mocks.offset.mockResolvedValueOnce([
      { id: "entry-1", body: "In range entry", createdAt: targetDate },
    ]);

    const req = createMockReq({ startDate: "2025-10-01", endDate: "2025-10-10" });
    const res = createMockRes();

    await runMiddlewares(historyHandler, req, res);

    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("combines search and date filters", async () => {
    const targetDate = new Date("2025-10-05");
    mocks.offset.mockResolvedValueOnce([
      { id: "entry-1", body: "Grateful and in range", createdAt: targetDate },
    ]);

    const req = createMockReq({ search: "grateful", startDate: "2025-10-01", endDate: "2025-10-10" });
    const res = createMockRes();

    await runMiddlewares(historyHandler, req, res);

    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("returns 400 when startDate is after endDate", async () => {
    const req = createMockReq({ startDate: "2025-10-10", endDate: "2025-10-01" });
    const res = createMockRes();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "startDate must be before or equal to endDate" });
  });

  it("returns empty results when no entries match filters", async () => {
    mocks.offset.mockResolvedValueOnce([]);

    const req = createMockReq({ search: "nonexistent" });
    const res = createMockRes();

    await runMiddlewares(historyHandler, req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        entries: [],
        pagination: expect.objectContaining({
          hasMore: false,
          nextOffset: null,
        }),
      }),
    );
  });

  it("handles special characters in search query", async () => {
    const now = new Date();
    mocks.offset.mockResolvedValueOnce([
      { id: "entry-1", body: "Entry with special chars: $%&", createdAt: now },
    ]);

    const req = createMockReq({ search: "$%&" });
    const res = createMockRes();

    await runMiddlewares(historyHandler, req, res);

    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("ignores empty search string", async () => {
    const now = new Date();
    mocks.offset.mockResolvedValueOnce([
      { id: "entry-1", body: "Any entry", createdAt: now },
    ]);

    const req = createMockReq({ search: "   " });
    const res = createMockRes();

    await runMiddlewares(historyHandler, req, res);

    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("maintains pagination with filters applied", async () => {
    const now = new Date();
    const entries = Array.from({ length: 21 }, (_, i) => ({
      id: `entry-${i}`,
      body: `Grateful entry ${i}`,
      createdAt: new Date(now.getTime() - i * 1000),
    }));

    mocks.offset.mockResolvedValueOnce(entries);

    const req = createMockReq({ search: "grateful", limit: "20", offset: "0" });
    const res = createMockRes();

    await runMiddlewares(historyHandler, req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        entries: expect.arrayContaining([
          expect.objectContaining({ id: "entry-0" }),
        ]),
        pagination: expect.objectContaining({
          hasMore: true,
          nextOffset: 20,
        }),
      }),
    );
  });
});