import { QueryClient, QueryFunction } from "@tanstack/react-query";

type ApiErrorInit = {
  status: number;
  message?: string;
  body?: unknown;
};

export class ApiError extends Error {
  status: number;
  body?: unknown;

  constructor({ status, message, body }: ApiErrorInit) {
    super(message || `Request failed with status ${status}`);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}

async function throwIfResNotOk(res: Response) {
  if (res.ok) {
    return;
  }

  const clone = res.clone();
  let parsedBody: unknown = undefined;
  let message = res.statusText || `Request failed with status ${res.status}`;

  try {
    const contentType = res.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      parsedBody = await clone.json();
      if (
        parsedBody &&
        typeof parsedBody === "object" &&
        "message" in parsedBody &&
        typeof (parsedBody as { message?: unknown }).message === "string"
      ) {
        message = ((parsedBody as { message: string }).message || message).trim() || message;
      }
    } else {
      const text = await clone.text();
      parsedBody = text;
      message = text.trim() || message;
    }
  } catch {
    // Ignore parsing errors and fall back to defaults.
  }

  throw new ApiError({ status: res.status, message, body: parsedBody });
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  const res = await fetch(url, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const res = await fetch(queryKey.join("/") as string, {
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
