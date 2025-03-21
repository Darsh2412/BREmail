import nodemailer from "nodemailer";
import { log } from "./vite";

interface SendEmailParams {
  to: string;
  cc?: string;
  bcc?: string;
  subject: string;
  message: string;
  attachments: Express.Multer.File[];
}

// Configure transporter
const createTransporter = () => {
  // Use environment variables for email configuration with fallbacks
  const host = process.env.SMTP_HOST || "smtp.example.com";
  const port = parseInt(process.env.SMTP_PORT || "587");
  const user = process.env.SMTP_USER || "user@example.com";
  const pass = process.env.SMTP_PASS || "password";
  const secure = process.env.SMTP_SECURE === "true";
  
  // For development/testing, use ethereal.email
  if (process.env.NODE_ENV !== "production") {
    log("Using ethereal.email for development email testing");
    return nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: process.env.ETHEREAL_USER || "ethereal.user@ethereal.email",
        pass: process.env.ETHEREAL_PASSWORD || "ethereal_password"
      }
    });
  }
  
  // For production
  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user,
      pass
    }
  });
};

export async function sendEmail({ 
  to, 
  cc, 
  bcc, 
  subject, 
  message, 
  attachments 
}: SendEmailParams) {
  try {
    const transporter = createTransporter();
    
    // Format attachments for nodemailer
    const formattedAttachments = attachments.map(file => ({
      filename: file.originalname,
      content: file.buffer,
      encoding: 'binary',
      contentType: file.mimetype
    }));
    
    // Send email
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || '"Email Sender" <sender@example.com>',
      to,
      cc,
      bcc,
      subject,
      html: message,
      attachments: formattedAttachments
    });
    
    // For development, log the preview URL
    if (process.env.NODE_ENV !== "production" && info.messageId) {
      log(`Message sent: ${info.messageId}`);
      log(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
    }
    
    return { messageId: info.messageId };
  } catch (error) {
    log(`Error in email service: ${error instanceof Error ? error.message : 'Unknown error'}`);
    throw error;
  }
}
