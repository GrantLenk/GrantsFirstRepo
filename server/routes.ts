import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertBroadcastSchema, insertUserWalletSchema, insertAdViewSchema } from "@shared/schema";
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

  // Connect wallet
  app.post("/api/wallet/connect", async (req, res) => {
    try {
      const data = insertUserWalletSchema.parse({
        ...req.body,
        connectedAt: new Date().toISOString(),
      });
      
      // Check if wallet already exists
      const existing = await storage.getUserWallet(data.walletAddress);
      if (existing) {
        res.json(existing);
        return;
      }
      
      const wallet = await storage.addUserWallet(data);
      res.json(wallet);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to connect wallet" });
      }
    }
  });

  // Get wallet info
  app.get("/api/wallet/:address", async (req, res) => {
    try {
      const wallet = await storage.getUserWallet(req.params.address);
      if (!wallet) {
        res.status(404).json({ message: "Wallet not found" });
        return;
      }
      res.json(wallet);
    } catch (error) {
      res.status(500).json({ message: "Failed to get wallet info" });
    }
  });

  // Record ad view
  app.post("/api/ad/view", async (req, res) => {
    try {
      const data = insertAdViewSchema.parse({
        ...req.body,
        viewedAt: new Date().toISOString(),
      });
      
      const view = await storage.recordAdView(data);
      res.json(view);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to record ad view" });
      }
    }
  });

  // Get user's ad views
  app.get("/api/user/:walletAddress/views", async (req, res) => {
    try {
      const views = await storage.getUserAdViews(req.params.walletAddress);
      res.json(views);
    } catch (error) {
      res.status(500).json({ message: "Failed to get user views" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
