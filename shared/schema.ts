import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const broadcasts = pgTable("broadcasts", {
  id: serial("id").primaryKey(),
  videoUrl: text("video_url").notNull(),
  broadcastTime: text("broadcast_time").notNull(), // stored as HH:MM format
  videoTitle: text("video_title").notNull(),
  date: text("date").notNull(), // stored as YYYY-MM-DD format
});

export const insertBroadcastSchema = createInsertSchema(broadcasts).omit({
  id: true,
});

export type InsertBroadcast = z.infer<typeof insertBroadcastSchema>;
export type Broadcast = typeof broadcasts.$inferSelect;
