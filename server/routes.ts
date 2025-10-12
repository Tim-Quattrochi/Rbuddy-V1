import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

// Import API route handlers
import moodHandler from "../api/daily-ritual/mood";
import intentionHandler from "../api/daily-ritual/intention";
import statsHandler from "../api/user/stats";

export async function registerRoutes(app: Express): Promise<Server> {
  // Daily Ritual Routes
  app.post("/api/daily-ritual/mood", ...moodHandler);
  app.post("/api/daily-ritual/intention", ...intentionHandler);
  
  // User Stats Routes
  app.get("/api/user/stats", ...statsHandler);

  const httpServer = createServer(app);

  return httpServer;
}
