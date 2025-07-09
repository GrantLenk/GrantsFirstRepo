import { broadcasts, type Broadcast, type InsertBroadcast, type UserWallet, type InsertUserWallet, type AdView, type InsertAdView } from "@shared/schema";

export interface IStorage {
  getBroadcast(date: string): Promise<Broadcast | undefined>;
  setBroadcast(broadcast: InsertBroadcast): Promise<Broadcast>;
  getCurrentBroadcast(): Promise<Broadcast | undefined>;
  
  // Wallet management
  addUserWallet(wallet: InsertUserWallet): Promise<UserWallet>;
  getUserWallet(walletAddress: string): Promise<UserWallet | undefined>;
  
  // Ad view tracking
  recordAdView(view: InsertAdView): Promise<AdView>;
  getAdViews(broadcastId: string): Promise<AdView[]>;
  getUserAdViews(walletAddress: string): Promise<AdView[]>;
}

export class MemStorage implements IStorage {
  private broadcasts: Map<string, Broadcast>;
  private userWallets: Map<string, UserWallet>;
  private adViews: Map<string, AdView>;
  private currentBroadcastId: number;
  private currentWalletId: number;
  private currentViewId: number;

  constructor() {
    this.broadcasts = new Map();
    this.userWallets = new Map();
    this.adViews = new Map();
    this.currentBroadcastId = 1;
    this.currentWalletId = 1;
    this.currentViewId = 1;
  }

  async getBroadcast(date: string): Promise<Broadcast | undefined> {
    return Array.from(this.broadcasts.values()).find(
      (broadcast) => broadcast.date === date
    );
  }

  async setBroadcast(insertBroadcast: InsertBroadcast): Promise<Broadcast> {
    const id = this.currentBroadcastId++;
    const broadcast: Broadcast = { 
      ...insertBroadcast, 
      id,
      adPayment: insertBroadcast.adPayment || "1000"
    };
    this.broadcasts.set(broadcast.date, broadcast);
    return broadcast;
  }

  async getCurrentBroadcast(): Promise<Broadcast | undefined> {
    const today = new Date().toISOString().split('T')[0];
    return this.getBroadcast(today);
  }

  // Wallet management
  async addUserWallet(insertWallet: InsertUserWallet): Promise<UserWallet> {
    const id = this.currentWalletId++;
    const wallet: UserWallet = { 
      ...insertWallet, 
      id,
      totalEarned: insertWallet.totalEarned || "0"
    };
    this.userWallets.set(wallet.walletAddress, wallet);
    return wallet;
  }

  async getUserWallet(walletAddress: string): Promise<UserWallet | undefined> {
    return this.userWallets.get(walletAddress);
  }

  // Ad view tracking
  async recordAdView(insertView: InsertAdView): Promise<AdView> {
    const id = this.currentViewId++;
    const view: AdView = { 
      ...insertView, 
      id,
      claimed: insertView.claimed || "false"
    };
    this.adViews.set(`${view.broadcastId}-${view.walletAddress}`, view);
    return view;
  }

  async getAdViews(broadcastId: string): Promise<AdView[]> {
    return Array.from(this.adViews.values()).filter(
      view => view.broadcastId === broadcastId
    );
  }

  async getUserAdViews(walletAddress: string): Promise<AdView[]> {
    return Array.from(this.adViews.values()).filter(
      view => view.walletAddress === walletAddress
    );
  }
}

export const storage = new MemStorage();
