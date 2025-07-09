import { broadcasts, type Broadcast, type InsertBroadcast } from "@shared/schema";

export interface IStorage {
  getBroadcast(date: string): Promise<Broadcast | undefined>;
  setBroadcast(broadcast: InsertBroadcast): Promise<Broadcast>;
  getCurrentBroadcast(): Promise<Broadcast | undefined>;
}

export class MemStorage implements IStorage {
  private broadcasts: Map<string, Broadcast>;
  private currentId: number;

  constructor() {
    this.broadcasts = new Map();
    this.currentId = 1;
  }

  async getBroadcast(date: string): Promise<Broadcast | undefined> {
    return Array.from(this.broadcasts.values()).find(
      (broadcast) => broadcast.date === date
    );
  }

  async setBroadcast(insertBroadcast: InsertBroadcast): Promise<Broadcast> {
    const id = this.currentId++;
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
}

export const storage = new MemStorage();
