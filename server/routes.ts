import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertBroadcastSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get today's broadcast
  app.get("/api/broadcast/today", async (req, res) => {
    try {
      const broadcast = await storage.getCurrentBroadcast();
      res.json(broadcast || null);
    } catch (error) {
      res.status(500).json({ message: "Failed to get broadcast" });
    }
  });

  // Set broadcast for today
  app.post("/api/broadcast", async (req, res) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const data = insertBroadcastSchema.parse({
        ...req.body,
        date: today,
      });
      
      const broadcast = await storage.setBroadcast(data);
      res.json(broadcast);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to set broadcast" });
      }
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
