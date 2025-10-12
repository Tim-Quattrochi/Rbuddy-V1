import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Mock } from "vitest";
import historyHandler, { handler } from "./history";

vi.mock("../../server/middleware/auth", () => ({
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

vi.mock("../../server/storage", () => {
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
});