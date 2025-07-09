import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const broadcasts = pgTable("broadcasts", {
  id: serial("id").primaryKey(),
  videoUrl: text("video_url").notNull(), // URL to the ad video
  broadcastTime: text("broadcast_time").notNull(), // time to display ad (HH:MM format)
  videoTitle: text("video_title").notNull(), // title of the advertisement
  date: text("date").notNull(), // date for the ad (YYYY-MM-DD format)
  adPayment: text("ad_payment").notNull().default("1000"), // advertiser payment amount
});

export const insertBroadcastSchema = createInsertSchema(broadcasts).omit({
  id: true,
});

export type InsertBroadcast = z.infer<typeof insertBroadcastSchema>;
export type Broadcast = typeof broadcasts.$inferSelect;
