import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

// Import API route handlers

import { middlewares as journalHistoryHandler } from "../api/journal/history.js";
import { middlewares as dailyRitualHandler } from "../api/daily-ritual/[action].js";
import { middlewares as userHandler } from "../api/users/[action].js";



// Import Auth route handlers
import { middlewares as googleAuthHandler } from "../api/auth/google.js";
import { middlewares as googleCallbackHandler } from "../api/auth/google/callback.js";
import { middlewares as logoutHandler } from "../api/auth/logout.js";

// Import Repair route handlers
import { middlewares as repairStartHandler } from "../api/repair/start";

// Import Chat route handler (shared across actions)
import { middlewares as chatHandler } from "../api/chat/[action]";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth Routes
  app.get("/api/auth/google", ...googleAuthHandler);
  app.get("/api/auth/google/callback", ...googleCallbackHandler);
  app.post("/api/auth/logout", ...logoutHandler);
  
  // User Routes
  // ⚠️ CRITICAL: Always use /api/users/... (PLURAL) - see docs/COMMON_ISSUES.md
  // This typo has occurred multiple times: /api/user/ vs /api/users/
  app.get("/api/users/me", ...userHandler);
  app.get("/api/users/stats", ...userHandler);
  app.get("/api/journal/history", ...journalHistoryHandler);
  
  // Daily Ritual Routes
  app.post("/api/daily-ritual/mood", ...dailyRitualHandler);
  app.post("/api/daily-ritual/intention", ...dailyRitualHandler);
  
  // Repair Routes
  app.post("/api/repair/start", ...repairStartHandler);
  
  // Chat Routes
  app.post("/api/chat/send", ...chatHandler);
  app.get("/api/chat/history", ...chatHandler);
  app.delete("/api/chat/clear", ...chatHandler);

  const httpServer = createServer(app);

  return httpServer;
}
