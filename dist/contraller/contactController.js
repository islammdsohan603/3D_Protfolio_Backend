import nodemailer from "nodemailer";
import Contact from "../models/Contact.js";
import connectDB from "../db/MongoDB.js";
export const handleContactSubmission = async (req, res) => {
    try {
        await connectDB();
        const { name, email, subject, message } = req.body;
        // 1. Validate incoming payload
        if (!name || typeof name !== "string" || !name.trim()) {
            res.status(400).json({ success: false, message: "Name is required and cannot be empty." });
            return;
        }
        if (!email || typeof email !== "string" || !email.trim()) {
            res.status(400).json({ success: false, message: "Email is required and cannot be empty." });
            return;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.trim())) {
            res.status(400).json({ success: false, message: "Please provide a valid email address." });
            return;
        }
        if (!message || typeof message !== "string" || !message.trim()) {
            res.status(400).json({ success: false, message: "Message is required and cannot be empty." });
            return;
        }
        const cleanName = name.trim();
        const cleanEmail = email.trim();
        const cleanSubject = subject && typeof subject === "string" && subject.trim() ? subject.trim() : "New Portfolio Contact Inquiry";
        const cleanMessage = message.trim();
        // 2. Store record in MongoDB
        const contactRecord = await Contact.create({
            name: cleanName,
            email: cleanEmail,
            subject: cleanSubject,
            message: cleanMessage,
        });
        console.log(`[ContactController] Contact saved to MongoDB. Document ID: ${contactRecord._id}`);
        // 3. Configure Nodemailer transporter & send alert email
        const emailUser = process.env.EMAIL_USER;
        const emailPass = process.env.EMAIL_PASS;
        const receiverEmail = process.env.RECEIVER_EMAIL || "islammdsohan603@gmail.com";
        if (emailUser && emailPass) {
            try {
                const transporter = nodemailer.createTransport({
                    service: "gmail",
                    auth: {
                        user: emailUser,
                        pass: emailPass,
                    },
                });
                const htmlEmailContent = `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0b0f19; color: #f3f4f6; margin: 0; padding: 20px; }
              .container { max-width: 600px; margin: 0 auto; background: #111827; border: 1px solid #1f2937; border-radius: 16px; padding: 32px; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5); }
              .header { border-bottom: 2px solid #06b6d4; padding-bottom: 16px; margin-bottom: 24px; text-align: left; }
              .header h2 { color: #38bdf8; margin: 0; font-size: 22px; font-weight: 700; letter-spacing: -0.5px; }
              .badge { display: inline-block; background: rgba(6, 182, 212, 0.15); border: 1px solid rgba(6, 182, 212, 0.3); color: #22d3ee; padding: 4px 12px; border-radius: 9999px; font-size: 11px; font-weight: 600; text-transform: uppercase; margin-bottom: 12px; }
              .field-group { margin-bottom: 18px; }
              .label { font-size: 11px; text-transform: uppercase; color: #9ca3af; font-weight: 700; letter-spacing: 0.05em; margin-bottom: 6px; }
              .value { font-size: 15px; color: #f9fafb; background: #1f2937; padding: 12px 16px; border-radius: 10px; border: 1px solid #374151; word-break: break-word; }
              .message-box { background: #1f2937; padding: 16px; border-radius: 10px; border-left: 4px solid #38bdf8; border-top: 1px solid #374151; border-right: 1px solid #374151; border-bottom: 1px solid #374151; white-space: pre-wrap; font-size: 15px; line-height: 1.6; color: #e5e7eb; }
              .footer { margin-top: 32px; font-size: 12px; color: #6b7280; text-align: center; border-top: 1px solid #1f2937; padding-top: 20px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <div class="badge">Portfolio Notification</div>
                <h2>📬 New Contact Form Submission</h2>
              </div>
              
              <div class="field-group">
                <div class="label">Sender Name</div>
                <div class="value">${cleanName}</div>
              </div>

              <div class="field-group">
                <div class="label">Sender Email</div>
                <div class="value"><a href="mailto:${cleanEmail}" style="color: #38bdf8; text-decoration: none; font-weight: 600;">${cleanEmail}</a></div>
              </div>

              <div class="field-group">
                <div class="label">Subject</div>
                <div class="value">${cleanSubject}</div>
              </div>

              <div class="field-group">
                <div class="label">Message Body</div>
                <div class="message-box">${cleanMessage}</div>
              </div>

              <div class="footer">
                <p>This message was dispatched automatically from your Express Portfolio Backend.</p>
              </div>
            </div>
          </body>
          </html>
        `;
                await transporter.sendMail({
                    from: `"${cleanName}" <${emailUser}>`,
                    replyTo: cleanEmail,
                    to: receiverEmail,
                    subject: `[Portfolio Contact] ${cleanSubject}`,
                    html: htmlEmailContent,
                });
                console.log(`[ContactController] Notification email sent successfully to ${receiverEmail}`);
            }
            catch (mailError) {
                console.error("[ContactController] Nodemailer error (saved to DB regardless):", mailError);
            }
        }
        else {
            console.warn("[ContactController] EMAIL_USER / EMAIL_PASS not set. Skipping email dispatch.");
        }
        // 4. Return standardized JSON response
        res.status(200).json({
            success: true,
            message: "Message received successfully. We will reach out within 24 hours.",
        });
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error("[ContactController] Controller exception:", errorMessage);
        res.status(500).json({
            success: false,
            message: "An internal server error occurred while sending your message. Please try again later.",
            error: process.env.NODE_ENV === "development" ? errorMessage : undefined,
        });
    }
};
//# sourceMappingURL=contactController.js.map