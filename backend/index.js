import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import twilio from 'twilio';
import mongoose from 'mongoose';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' })); // Increased limit for base64 images

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI;

if (MONGODB_URI) {
    mongoose.connect(MONGODB_URI)
        .then(() => console.log('✅ Connected to MongoDB Database'))
        .catch(err => console.error('❌ MongoDB Connection Error:', err));
} else {
    console.log('⚠️  MONGODB_URI not found in .env. Product database will not work.');
}

// --- MODELS ---

const productSchema = new mongoose.Schema({
    title: { type: String, required: true },
    category: { type: String, required: true },
    description: String,
    price: String,
    image: String,
    whatsappMsg: String,
    createdAt: { type: Date, default: Date.now }
});

const Product = mongoose.model('Product', productSchema);

// --- API ROUTES ---

// 1. Root & Status
app.get('/', (req, res) => {
    res.json({
        message: 'Viral Print Backend API is active!',
        status: 'online',
        database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
    });
});

// 2. Products CRUD
app.get('/api/products', async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });
        res.json({ success: true, data: products });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

app.post('/api/products', async (req, res) => {
    try {
        const newProduct = new Product(req.body);
        const savedProduct = await newProduct.save();
        res.status(201).json({ success: true, data: savedProduct });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
});

app.put('/api/products/:id', async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json({ success: true, data: updatedProduct });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
});

app.delete('/api/products/:id', async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'Product deleted' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// 3. Contact/Quote submission handler
app.post('/api/contact', async (req, res) => {
    const { name, email, phone, service, details } = req.body;

    if (!name || !email || !phone || !service || !details) {
        return res.status(400).json({
            success: false,
            message: 'All fields are required.'
        });
    }

    console.log(`📥 NEW CONTACT FORM SUBMISSION: ${name}`);

    let emailSent = false;
    let smsSent = false;

    // Send Email Logic
    const adminEmail = process.env.ADMIN_EMAIL || 'hello@viralprint.com';
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;

    if (smtpUser && smtpPass) {
        try {
            const transporter = nodemailer.createTransport({
                host: process.env.SMTP_HOST || 'smtp.gmail.com',
                port: parseInt(process.env.SMTP_PORT || '587'),
                secure: process.env.SMTP_SECURE === 'true',
                auth: { user: smtpUser, pass: smtpPass }
            });

            const htmlContent = `
            <div style="background:#050505; color:#fff; padding:40px; font-family:sans-serif;">
                <h1 style="color:#00F0FF;">NEW PROJECT REQUEST</h1>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Phone:</strong> ${phone}</p>
                <p><strong>Service:</strong> ${service}</p>
                <p><strong>Details:</strong> ${details}</p>
            </div>`;

            await transporter.sendMail({
                from: `"Viral Print" <${smtpUser}>`,
                to: adminEmail,
                subject: `🔥 Quote Request: ${name}`,
                html: htmlContent
            });
            emailSent = true;
        } catch (err) { console.error('Email Error:', err.message); }
    }

    // SMS Logic
    const twilioSid = process.env.TWILIO_ACCOUNT_SID;
    const twilioToken = process.env.TWILIO_AUTH_TOKEN;
    const twilioPhone = process.env.TWILIO_PHONE_NUMBER;

    if (twilioSid && twilioToken && twilioPhone) {
        try {
            const client = twilio(twilioSid, twilioToken);
            await client.messages.create({
                body: `Hi ${name}, we received your request for ${service}. We'll contact you shortly!`,
                from: twilioPhone,
                to: phone
            });
            smsSent = true;
        } catch (err) { console.error('SMS Error:', err.message); }
    }

    return res.status(200).json({
        success: true,
        message: 'Request sent successfully!',
        notifications: { email: emailSent, sms: smsSent }
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 BACKEND RUNNING ON PORT ${PORT}`);
});
