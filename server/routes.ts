import type { Express, Request } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { upload } from "./multer-config";
import { sendEmail } from "./email-service";
import { emailSchema } from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import { log } from "./vite";

export async function registerRoutes(app: Express): Promise<Server> {
  // Email sending endpoint
  app.post("/api/send-email", upload.array("attachments"), async (req: Request, res) => {
    try {
      // Validate the request body
      const { to, cc, bcc, subject, message, senderEmail, senderPassword } = req.body;
      
      // Check if sender credentials are provided
      if (!senderEmail || !senderPassword) {
        return res.status(400).json({ 
          message: "Sender email and password are required"
        });
      }
      
      const validatedData = emailSchema.parse({
        to,
        cc: cc || "",
        bcc: bcc || "",
        subject,
        message,
        senderEmail,
        senderPassword
      });
      
      // Access files uploaded by multer
      const files = (req.files || []) as Express.Multer.File[];
      
      // Send the email
      const result = await sendEmail({
        to: validatedData.to,
        cc: validatedData.cc,
        bcc: validatedData.bcc,
        subject: validatedData.subject,
        message: validatedData.message,
        attachments: files,
        senderEmail: validatedData.senderEmail,
        senderPassword: validatedData.senderPassword
      });
      
      // Store sent email in database
      const attachmentInfo = files.map(file => ({
        filename: file.originalname,
        size: file.size,
        mimetype: file.mimetype
      }));
      
      await storage.createEmail({
        to: validatedData.to,
        cc: validatedData.cc,
        bcc: validatedData.bcc,
        subject: validatedData.subject,
        message: validatedData.message,
        attachmentInfo,
        senderEmail: validatedData.senderEmail
      });
      
      log(`Email sent to: ${validatedData.to}`);
      
      return res.status(200).json({ message: "Email sent successfully", result });
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      
      log(`Error sending email: ${error instanceof Error ? error.message : 'Unknown error'}`);
      
      return res.status(500).json({ 
        message: `Failed to send email: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
