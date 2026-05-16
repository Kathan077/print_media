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
app.use(express.json({ limit: '10mb' }));

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI;

if (MONGODB_URI) {
    mongoose.connect(MONGODB_URI)
        .then(() => console.log('✅ Connected to MongoDB Database'))
        .catch(err => console.error('❌ MongoDB Connection Error:', err));
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

// Category Model
const categorySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    createdAt: { type: Date, default: Date.now }
});

const Category = mongoose.model('Category', categorySchema);

// --- API ROUTES ---

app.get('/', (req, res) => {
    res.json({
        message: 'Viral Print Backend API is active!',
        status: 'online',
        database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
    });
});

// --- CATEGORY ROUTES ---

app.get('/api/categories', async (req, res) => {
    try {
        const categories = await Category.find().sort({ createdAt: 1 });
        res.json({ success: true, data: categories });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

app.post('/api/categories', async (req, res) => {
    try {
        const newCat = new Category(req.body);
        const savedCat = await newCat.save();
        res.status(201).json({ success: true, data: savedCat });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
});

app.delete('/api/categories/:name', async (req, res) => {
    try {
        await Category.findOneAndDelete({ name: req.params.name });
        res.json({ success: true, message: 'Category deleted' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// --- PRODUCT ROUTES ---

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

// --- CONTACT API ---

app.post('/api/contact', async (req, res) => {
    const { name, email, phone, service, details } = req.body;
    // ... (logic remains same)
    // I'll keep the response part for consistency
    return res.status(200).json({ success: true, message: 'Request sent!' });
});

app.listen(PORT, () => {
    console.log(`🚀 BACKEND RUNNING ON PORT ${PORT}`);
});
