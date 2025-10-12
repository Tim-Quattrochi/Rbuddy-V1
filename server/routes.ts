import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

// Import API route handlers

import journalHistoryHandler from "../api/journal/history";
import { middlewares as dailyRitualHandler } from "../api/daily-ritual/[action]";
import { middlewares as userHandler } from "../api/user/[action]";



// Import Auth route handlers
import { middlewares as googleAuthHandler } from "../api/auth/google/index";
import googleCallbackHandler from "../api/auth/google.callback";
import { middlewares as logoutHandler } from "../api/auth/logout";

// Import Repair route handlers
import { middlewares as repairStartHandler } from "../api/repair/start";

// Import Chat route handler (shared across actions)
import { middlewares as chatHandler } from "../api/chat/[action]";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth Routes
  app.get("/api/auth/google", ...googleAuthHandler);
  app.get("/api/auth/google/callback", googleCallbackHandler);
  app.post("/api/auth/logout", ...logoutHandler);
  
  // User Routes
  app.get("/api/users/me", ...userHandler);
  app.get("/api/user/stats", ...userHandler);
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
