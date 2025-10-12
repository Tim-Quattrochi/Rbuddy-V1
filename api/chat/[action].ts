import { Request, Response, NextFunction, RequestHandler } from "express";
import { requireAuth, AuthenticatedRequest } from "../_lib/middleware/auth.js";
import { chatSendLimiter, chatGeneralLimiter } from "../_lib/middleware/rateLimiter.js";
import AIChatService from "../_lib/services/aiChatService.js";
import { createVercelHandler } from "../_lib/vercel-handler.js";

const MESSAGE_MAX_LENGTH = 1000;
const CHAT_HISTORY_LIMIT_MIN = 1;
const CHAT_HISTORY_LIMIT_MAX = 100;
const CHAT_HISTORY_LIMIT_DEFAULT = 20;

export async function handleSend(
  req: AuthenticatedRequest,
  res: Response
) {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { message } = req.body ?? {};

    if (!message || typeof message !== "string" || message.trim().length === 0) {
      return res.status(400).json({ error: "Message is required" });
    }

    if (message.length > MESSAGE_MAX_LENGTH) {
      return res.status(400).json({
        error: `Message too long (max ${MESSAGE_MAX_LENGTH} characters)`,
      });
    }

    const chatService = new AIChatService();
    const response = await chatService.sendMessage(userId, message.trim());

    return res.json({ response });
  } catch (error) {
    console.error("[Chat API] Error sending message:", error);
    return res.status(500).json({
      error: "Failed to process message",
      ...(process.env.NODE_ENV === "development" && {
        details: error instanceof Error ? error.message : "Unknown error",
      }),
    });
  }
}

export async function handleHistory(
  req: AuthenticatedRequest,
  res: Response
) {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const requestedLimit = parseInt(req.query.limit as string) || CHAT_HISTORY_LIMIT_DEFAULT;
    const limit = Math.min(
      Math.max(requestedLimit, CHAT_HISTORY_LIMIT_MIN),
      CHAT_HISTORY_LIMIT_MAX
    );

    const chatService = new AIChatService();
    const messages = await chatService.getMessages(userId, limit);

    return res.json({ messages });
  } catch (error) {
    console.error("[Chat API] Error getting history:", error);
    return res.status(500).json({ error: "Failed to get chat history" });
  }
}

export async function handleClear(
  req: AuthenticatedRequest,
  res: Response
) {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const chatService = new AIChatService();
    await chatService.clearHistory(userId);

    return res.json({ success: true });
  } catch (error) {
    console.error("[Chat API] Error clearing history:", error);
    return res.status(500).json({ error: "Failed to clear chat history" });
  }
}

type ChatAction = "send" | "history" | "clear";

const actionConfig: Record<
  ChatAction,
  {
    method: "GET" | "POST" | "DELETE";
    limiter: RequestHandler;
    handler: (req: AuthenticatedRequest, res: Response) => Promise<Response | void>;
  }
> = {
  send: { method: "POST", limiter: chatSendLimiter, handler: handleSend },
  history: { method: "GET", limiter: chatGeneralLimiter, handler: handleHistory },
  clear: { method: "DELETE", limiter: chatGeneralLimiter, handler: handleClear },
};

function resolveAction(req: Request): ChatAction | null {
  const fromParams = (req as any).params?.action;
  if (typeof fromParams === "string" && fromParams) {
    return fromParams as ChatAction;
  }

  const queryValue = req.query?.action;
  if (typeof queryValue === "string" && queryValue) {
    return queryValue as ChatAction;
  }
  if (Array.isArray(queryValue) && queryValue[0]) {
    return queryValue[0] as ChatAction;
  }

  const path = (req as any).path || req.url || "";
  const segments = path.split("?")[0]?.split("/").filter(Boolean) ?? [];
  const lastSegment = segments[segments.length - 1];
  if (lastSegment === "send" || lastSegment === "history" || lastSegment === "clear") {
    return lastSegment as ChatAction;
  }
  return null;
}

function runMiddleware(req: Request, res: Response, middleware: RequestHandler) {
  return new Promise<void>((resolve, reject) => {
    middleware(req, res, (err?: any) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

const dispatchHandler: RequestHandler = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const action = resolveAction(req as Request);
    if (!action) {
      return res.status(404).json({ error: "Not Found" });
    }

    const config = actionConfig[action];
    if (!config || req.method.toUpperCase() !== config.method) {
      return res.status(405).json({ error: "Method Not Allowed" });
    }

    await runMiddleware(req, res, config.limiter);
    await config.handler(req, res);
  } catch (error) {
    next(error);
  }
};

export const middlewares = [requireAuth, dispatchHandler];

export default createVercelHandler(middlewares);
