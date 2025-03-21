import nodemailer from "nodemailer";
import { log } from "./vite";

interface SendEmailParams {
  to: string;
  cc?: string;
  bcc?: string;
  subject: string;
  message: string;
  attachments: Express.Multer.File[];
  senderEmail: string;
  senderPassword: string;
}

// Configure transporter
const createTransporter = (email: string, password: string) => {
  // Gmail is required for sending
  log(`Using Gmail credentials for: ${email}`);
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: email,
      pass: password // This should be an app password for Gmail
    }
  });
};

export async function sendEmail({ 
  to, 
  cc, 
  bcc, 
  subject, 
  message, 
  attachments,
  senderEmail,
  senderPassword
}: SendEmailParams) {
  try {
    const transporter = createTransporter(senderEmail, senderPassword);
    
    // Format attachments for nodemailer
    const formattedAttachments = attachments.map(file => ({
      filename: file.originalname,
      content: file.buffer,
      encoding: 'binary',
      contentType: file.mimetype
    }));
    
    // Send email (sender is always the Gmail address provided)
    const info = await transporter.sendMail({
      from: senderEmail,
      to,
      cc,
      bcc,
      subject,
      html: message,
      attachments: formattedAttachments
    });
    
    log(`Email sent from ${senderEmail} to ${to}`);
    
    return { messageId: info.messageId };
  } catch (error) {
    log(`Error in email service: ${error instanceof Error ? error.message : 'Unknown error'}`);
    throw error;
  }
}
