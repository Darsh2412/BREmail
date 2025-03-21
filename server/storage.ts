import { emails, type Email, type InsertEmail } from "@shared/schema";

export interface IStorage {
  createEmail(email: InsertEmail): Promise<Email>;
  getEmails(): Promise<Email[]>;
  getEmailById(id: number): Promise<Email | undefined>;
}

export class MemStorage implements IStorage {
  private emails: Map<number, Email>;
  private currentId: number;

  constructor() {
    this.emails = new Map();
    this.currentId = 1;
  }

  async createEmail(insertEmail: InsertEmail): Promise<Email> {
    const id = this.currentId++;
    const sentAt = new Date();
    const email: Email = { 
      ...insertEmail, 
      id, 
      sentAt
    };
    this.emails.set(id, email);
    return email;
  }

  async getEmails(): Promise<Email[]> {
    return Array.from(this.emails.values());
  }

  async getEmailById(id: number): Promise<Email | undefined> {
    return this.emails.get(id);
  }
}

export const storage = new MemStorage();
