import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import twilio from 'twilio';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Root endpoint for testing
app.get('/', (req, res) => {
    res.json({
        message: 'Viral Print Backend API is active!',
        status: 'online',
        endpoints: {
            submitContact: 'POST /api/contact'
        }
    });
});

// Contact/Quote submission handler
app.post('/api/contact', async (req, res) => {
    const { name, email, phone, service, details } = req.body;

    // Validation
    if (!name || !email || !phone || !service || !details) {
        return res.status(400).json({
            success: false,
            message: 'All fields (name, email, phone, service, details) are required.'
        });
    }

    console.log(`\n==================================================`);
    console.log(`📥 NEW CONTACT FORM SUBMISSION RECEIVED`);
    console.log(`==================================================`);
    console.log(`👤 Name:    ${name}`);
    console.log(`📧 Email:   ${email}`);
    console.log(`📞 Phone:   ${phone}`);
    console.log(`🛠️ Service: ${service}`);
    console.log(`📝 Details: ${details}`);
    console.log(`==================================================\n`);

    let emailSent = false;
    let smsSent = false;
    let emailStatus = 'Not configured';
    let smsStatus = 'Not configured';

    // 1. Send HTML Email to Admin via Nodemailer
    const adminEmail = process.env.ADMIN_EMAIL || 'hello@viralprint.com';
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;

    if (smtpUser && smtpPass) {
        try {
            const transporter = nodemailer.createTransport({
                host: process.env.SMTP_HOST || 'smtp.gmail.com',
                port: parseInt(process.env.SMTP_PORT || '587'),
                secure: process.env.SMTP_SECURE === 'true',
                auth: {
                    user: smtpUser,
                    pass: smtpPass
                }
            });

            // "God-Level" Premium HTML Email Template
            const htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <style>
                    body {
                        margin: 0;
                        padding: 0;
                        background-color: #050505;
                        font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
                        color: #ffffff;
                    }
                    .email-wrapper {
                        background-color: #050505;
                        padding: 40px 20px;
                    }
                    .card {
                        max-width: 600px;
                        margin: 0 auto;
                        background: #0d0e12;
                        border: 1px solid rgba(0, 240, 255, 0.15);
                        border-radius: 16px;
                        overflow: hidden;
                        box-shadow: 0 10px 40px rgba(0, 240, 255, 0.05);
                    }
                    .header {
                        background: linear-gradient(135deg, #001f3f 0%, #0a0a0d 100%);
                        padding: 40px 30px;
                        text-align: center;
                        border-bottom: 2px solid #00F0FF;
                        position: relative;
                    }
                    .logo {
                        font-size: 28px;
                        font-weight: 900;
                        letter-spacing: 2px;
                        text-transform: uppercase;
                        margin: 0;
                        color: #ffffff;
                    }
                    .logo span {
                        color: #00F0FF;
                    }
                    .subtitle {
                        color: rgba(255, 255, 255, 0.6);
                        font-size: 13px;
                        text-transform: uppercase;
                        letter-spacing: 3px;
                        margin-top: 8px;
                    }
                    .content {
                        padding: 40px 30px;
                    }
                    .section-title {
                        font-size: 14px;
                        color: #FF007A;
                        text-transform: uppercase;
                        letter-spacing: 2px;
                        font-weight: 700;
                        margin-bottom: 25px;
                        border-left: 3px solid #FF007A;
                        padding-left: 10px;
                    }
                    .field-table {
                        width: 100%;
                        border-collapse: collapse;
                        margin-bottom: 30px;
                    }
                    .field-table td {
                        padding: 14px 0;
                        border-bottom: 1px solid rgba(255, 255, 255, 0.05);
                    }
                    .field-label {
                        color: rgba(255, 255, 255, 0.4);
                        font-size: 12px;
                        text-transform: uppercase;
                        letter-spacing: 1.5px;
                        width: 140px;
                        font-weight: 600;
                    }
                    .field-value {
                        color: #ffffff;
                        font-size: 15px;
                        font-weight: 500;
                    }
                    .field-value a {
                        color: #00F0FF;
                        text-decoration: none;
                    }
                    .details-box {
                        background: rgba(255, 255, 255, 0.02);
                        border: 1px solid rgba(255, 255, 255, 0.05);
                        border-radius: 8px;
                        padding: 20px;
                        font-size: 15px;
                        line-height: 1.6;
                        color: rgba(255, 255, 255, 0.85);
                        white-space: pre-wrap;
                    }
                    .footer {
                        background: #08090c;
                        padding: 25px 30px;
                        text-align: center;
                        font-size: 11px;
                        color: rgba(255, 255, 255, 0.3);
                        border-top: 1px solid rgba(255, 255, 255, 0.03);
                    }
                    .footer a {
                        color: rgba(255, 255, 255, 0.5);
                        text-decoration: none;
                    }
                </style>
            </head>
            <body>
                <div class="email-wrapper">
                    <div class="card">
                        <div class="header">
                            <h1 class="logo">VIRAL<span>PRINT</span></h1>
                            <div class="subtitle">New Creative Request</div>
                        </div>
                        <div class="content">
                            <div class="section-title">Project Specifications</div>
                            <table class="field-table">
                                <tr>
                                    <td class="field-label">Full Name</td>
                                    <td class="field-value">${name}</td>
                                </tr>
                                <tr>
                                    <td class="field-label">Email</td>
                                    <td class="field-value"><a href="mailto:${email}">${email}</a></td>
                                </tr>
                                <tr>
                                    <td class="field-label">Phone</td>
                                    <td class="field-value"><a href="tel:${phone}">${phone}</a></td>
                                </tr>
                                <tr>
                                    <td class="field-label">Service Type</td>
                                    <td class="field-value" style="color: #00F0FF; font-weight: bold;">${service.toUpperCase().replace('-', ' ')}</td>
                                </tr>
                            </table>
                            
                            <div class="section-title">Details & Scope</div>
                            <div class="details-box">${details}</div>
                        </div>
                        <div class="footer">
                            This is an automated notification from <a href="https://viralprint.com">Viral Print Studio</a>.<br>
                            &copy; ${new Date().getFullYear()} Viral Print. All rights reserved.
                        </div>
                    </div>
                </div>
            </body>
            </html>
            `;

            await transporter.sendMail({
                from: `"Viral Print Notifications" <${smtpUser}>`,
                to: adminEmail,
                subject: `🔥 New Project Quote Request: ${name} (${service})`,
                html: htmlContent
            });

            emailSent = true;
            emailStatus = 'Sent successfully';
            console.log(`✅ Nodemailer: Email successfully sent to ${adminEmail}!`);
        } catch (err) {
            console.error('❌ Nodemailer Error:', err.message);
            emailStatus = `Error: ${err.message}`;
        }
    } else {
        console.log('⚠️  Nodemailer SMTP not configured (credentials missing in .env). Email logged in sandbox mode.');
        emailStatus = 'Sandbox Mode (Credentials missing)';
    }

    // 2. Send SMS to User via Twilio
    const twilioSid = process.env.TWILIO_ACCOUNT_SID;
    const twilioToken = process.env.TWILIO_AUTH_TOKEN;
    const twilioPhone = process.env.TWILIO_PHONE_NUMBER;

    const smsMessage = `Hi ${name}, thank you for contacting Viral Print! We have received your request for "${service.replace('-', ' ')}". Our estimating team will get back to you with an exact quote shortly.`;

    if (twilioSid && twilioToken && twilioPhone) {
        try {
            const client = twilio(twilioSid, twilioToken);
            await client.messages.create({
                body: smsMessage,
                from: twilioPhone,
                to: phone
            });
            smsSent = true;
            smsStatus = 'Sent successfully';
            console.log(`✅ Twilio: Confirmation SMS successfully sent to ${phone}!`);
        } catch (err) {
            console.error('❌ Twilio Error:', err.message);
            smsStatus = `Error: ${err.message}`;
        }
    } else {
        console.log('⚠️  Twilio not configured (credentials missing in .env).');
        console.log(`📲 MOCK PHONE MESSAGE TO ${phone}:`);
        console.log(`   "${smsMessage}"`);
        smsStatus = 'Sandbox Mode (Credentials missing)';
    }

    // Return combined status report to client
    return res.status(200).json({
        success: true,
        message: 'Your quote request has been sent! We will contact you shortly.',
        data: {
            name,
            service,
            emailStatus,
            smsStatus
        }
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`\n🚀 ==================================================`);
    console.log(`⚡ VIRAL PRINT BACKEND IS RUNNING ON PORT ${PORT}`);
    console.log(`🔗 API Endpoint: http://localhost:${PORT}/api/contact`);
    console.log(`==================================================== 🚀\n`);
});
