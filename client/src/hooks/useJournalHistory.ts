import { useInfiniteQuery } from "@tanstack/react-query";
import { ApiError } from "@/lib/queryClient";

export interface JournalEntry {
  id: string;
  body: string;
  createdAt: string;
}

export interface JournalHistoryResponse {
  entries: JournalEntry[];
  pagination: {
    limit: number;
    offset: number;
    hasMore: boolean;
    nextOffset: number | null;
  };
}

const PAGE_SIZE = 20;

async function fetchJournalHistory(offset: number, limit: number): Promise<JournalHistoryResponse> {
  const params = new URLSearchParams({
    offset: offset.toString(),
    limit: limit.toString(),
  });

  const res = await fetch(`/api/journal/history?${params.toString()}`, {
    credentials: "include",
  });

  if (!res.ok) {
    let body: unknown = undefined;
    let message = res.statusText || `Request failed with status ${res.status}`;

    try {
      body = await res.json();
      if (
        body &&
        typeof body === "object" &&
        "error" in body &&
        typeof (body as { error?: unknown }).error === "string"
      ) {
        message = ((body as { error: string }).error || message).trim() || message;
      }
    } catch {
      // Ignore JSON parsing errors and fall back to defaults.
    }

    throw new ApiError({ status: res.status, message, body });
  }

  return res.json();
}

export function useJournalHistory(pageSize: number = PAGE_SIZE) {
  return useInfiniteQuery({
    queryKey: ["journalHistory", pageSize],
    initialPageParam: 0,
    queryFn: ({ pageParam }) => fetchJournalHistory(Number(pageParam ?? 0), pageSize),
    getNextPageParam: (lastPage) =>
      lastPage.pagination.hasMore ? lastPage.pagination.nextOffset ?? undefined : undefined,
  });
}