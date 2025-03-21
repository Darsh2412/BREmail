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
    
    // Ensure senderEmail is always provided (now required)
    if (!insertEmail.senderEmail) {
      throw new Error("Sender email is required");
    }
    
    // Handle nulls for optional fields
    const email: Email = { 
      id,
      sentAt,
      to: insertEmail.to,
      cc: insertEmail.cc || null,
      bcc: insertEmail.bcc || null,
      subject: insertEmail.subject,
      message: insertEmail.message,
      attachmentInfo: insertEmail.attachmentInfo || null,
      senderEmail: insertEmail.senderEmail // This is now required
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
