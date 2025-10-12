import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

// Import API route handlers

import journalHistoryHandler from "../api/journal/history";
import { middlewares as moodHandler } from "../api/daily-ritual/mood";
import { middlewares as intentionHandler } from "../api/daily-ritual/intention";
import { middlewares as statsHandler } from "../api/user/stats";
import { middlewares as meHandler } from "../api/user/me";



// Import Auth route handlers
import googleAuthHandler from "../api/auth/google/index";
import googleCallbackHandler from "../api/auth/google.callback";
import { middlewares as logoutHandler } from "../api/auth/logout";

// Import Repair route handlers
import { middlewares as repairStartHandler } from "../api/repair/start";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth Routes
  app.get("/api/auth/google", googleAuthHandler);
  app.get("/api/auth/google/callback", googleCallbackHandler);
  app.post("/api/auth/logout", ...logoutHandler);
  
  // User Routes
  app.get("/api/users/me", ...meHandler);
  app.get("/api/journal/history", ...journalHistoryHandler);
  
  // Daily Ritual Routes
  app.post("/api/daily-ritual/mood", ...moodHandler);
  app.post("/api/daily-ritual/intention", ...intentionHandler);
  
  // Repair Routes
  app.post("/api/repair/start", ...repairStartHandler);
  
  // User Stats Routes
  app.get("/api/user/stats", ...statsHandler);

  const httpServer = createServer(app);

  return httpServer;
}
