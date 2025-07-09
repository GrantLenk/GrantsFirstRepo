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

export const userWallets = pgTable("user_wallets", {
  id: serial("id").primaryKey(),
  walletAddress: text("wallet_address").notNull().unique(),
  userId: text("user_id").notNull(), // session-based user ID
  connectedAt: text("connected_at").notNull(), // timestamp when wallet was connected
  totalEarned: text("total_earned").notNull().default("0"), // total earnings in USD
});

export const adViews = pgTable("ad_views", {
  id: serial("id").primaryKey(),
  broadcastId: text("broadcast_id").notNull(),
  walletAddress: text("wallet_address").notNull(),
  viewedAt: text("viewed_at").notNull(),
  rewardAmount: text("reward_amount").notNull(),
  claimed: text("claimed").notNull().default("false"),
});

export const insertBroadcastSchema = createInsertSchema(broadcasts).omit({
  id: true,
});

export const insertUserWalletSchema = createInsertSchema(userWallets).omit({
  id: true,
});

export const insertAdViewSchema = createInsertSchema(adViews).omit({
  id: true,
});

export type InsertBroadcast = z.infer<typeof insertBroadcastSchema>;
export type Broadcast = typeof broadcasts.$inferSelect;
export type InsertUserWallet = z.infer<typeof insertUserWalletSchema>;
export type UserWallet = typeof userWallets.$inferSelect;
export type InsertAdView = z.infer<typeof insertAdViewSchema>;
export type AdView = typeof adViews.$inferSelect;
