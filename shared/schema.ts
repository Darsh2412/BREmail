import { pgTable, text, serial, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Email schema for storing sent emails
export const emails = pgTable("emails", {
  id: serial("id").primaryKey(),
  to: text("to").notNull(),
  cc: text("cc"),
  bcc: text("bcc"),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  attachmentInfo: jsonb("attachment_info"),
  sentAt: timestamp("sent_at").defaultNow().notNull(),
  senderEmail: text("sender_email"),
});

// Schema for validating email input
export const emailSchema = z.object({
  to: z.string().min(1, "Recipients are required"),
  cc: z.string().optional(),
  bcc: z.string().optional(),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(1, "Message is required"),
  senderEmail: z.string().email("Valid sender email is required"),
  senderPassword: z.string().min(1, "Sender password is required"),
});

// Schema for validating sender credentials
export const senderCredentialsSchema = z.object({
  email: z.string().email("Valid email is required"),
  password: z.string().min(1, "Password is required"),
});

export const insertEmailSchema = createInsertSchema(emails).omit({
  id: true,
  sentAt: true
});

export type InsertEmail = z.infer<typeof insertEmailSchema>;
export type Email = typeof emails.$inferSelect;
export type SenderCredentials = z.infer<typeof senderCredentialsSchema>;
