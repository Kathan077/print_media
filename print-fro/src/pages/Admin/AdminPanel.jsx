import React, { useState, useEffect } from 'react';
import './AdminPanel.css';

const AdminPanel = () => {
    const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/$/, "");

    const [isAuthenticated, setIsAuthenticated] = useState(() => localStorage.getItem("viralprint_admin_auth") === "true");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
    const [status, setStatus] = useState("Checking...");

    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [newCategory, setNewCategory] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState("dashboard");
    
    const [formData, setFormData] = useState({ title: "", category: "", description: "", price: "", image: "" });
    const [editingId, setEditingId] = useState(null);

    const checkStatus = async () => {
        try {
            const res = await fetch(`${API_URL}/api/status`);
            const data = await res.json();
            setStatus(data.database === 'connected' ? "✅ LIVE" : "❌ DB OFFLINE");
        } catch (e) { setStatus("❌ API OFFLINE"); }
    };

    const fetchData = async () => {
        try {
            const [pRes, cRes] = await Promise.all([
                fetch(`${API_URL}/api/products`),
                fetch(`${API_URL}/api/categories`)
            ]);
            const pData = await pRes.json();
            const cData = await cRes.json();
            if (pData.success) setProducts(pData.data);
            if (cData.success) setCategories(cData.data.map(c => c.name));
        } catch (e) { console.error(e); }
    };

    useEffect(() => {
        checkStatus();
        fetchData();
    }, []);

    const handleLogin = (e) => {
        e.preventDefault();
        if (phone === "9875270319" && password === "viral@123") {
            localStorage.setItem("viralprint_admin_auth", "true");
            setIsAuthenticated(true);
        } else { 
            setError("Invalid credentials. Try again."); 
            setTimeout(() => setError(""), 3000);
        }
    };

    const handleSaveProduct = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const method = editingId ? 'PUT' : 'POST';
            const url = editingId ? `${API_URL}/api/products/${editingId}` : `${API_URL}/api/products`;
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await res.json();
            if (data.success) {
                setSuccessMsg(editingId ? "Product Updated!" : "Product Added!");
                fetchData();
                setFormData({ title: "", category: "", description: "", price: "", image: "" });
                setEditingId(null);
            }
        } catch (e) { setError("Failed to save product."); }
        finally { setIsLoading(false); setTimeout(() => {setSuccessMsg(""); setError("");}, 3000); }
    };

    const handleDeleteProduct = async (id) => {
        if (!window.confirm("Are you sure you want to delete this product?")) return;
        await fetch(`${API_URL}/api/products/${id}`, { method: 'DELETE' });
        fetchData();
        setSuccessMsg("Product deleted.");
        setTimeout(() => setSuccessMsg(""), 3000);
    };

    const handleAddCategory = async (e) => {
        e.preventDefault();
        if (!newCategory) return;
        const res = await fetch(`${API_URL}/api/categories`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: newCategory })
        });
        const data = await res.json();
        if (data.success) {
            setNewCategory("");
            fetchData();
            setSuccessMsg("Category Added!");
        } else { setError("Category exists or error."); }
        setTimeout(() => {setSuccessMsg(""); setError("");}, 3000);
    };

    const handleDeleteCategory = async (name) => {
        if (!window.confirm(`Delete category '${name}'?`)) return;
        await fetch(`${API_URL}/api/categories/${name}`, { method: 'DELETE' });
        fetchData();
    };

    if (!isAuthenticated) {
        return (
            <div className="admin-login-container">
                <form className="admin-login-form" onSubmit={handleLogin}>
                    <h2>VIRAL<span>ADMIN</span></h2>
                    <p style={{marginBottom: '1.5rem', color: '#888'}}>Enter your credentials to manage catalog</p>
                    {error && <p style={{color: '#ff4444', marginBottom: '1rem', fontSize: '0.9rem'}}>{error}</p>}
                    <input type="text" placeholder="Phone Number" value={phone} onChange={e => setPhone(e.target.value)} required />
                    <input type="password" placeholder="Admin Password" value={password} onChange={e => setPassword(e.target.value)} required />
                    <button type="submit">Unlock Dashboard</button>
                </form>
            </div>
        );
    }

    return (
        <div className="admin-panel-layout">
            <aside className="admin-sidebar glass">
                <h3>VIRAL<span>ADMIN</span></h3>
                <nav className="sidebar-nav">
                    <button className={activeTab === "dashboard" ? "active" : ""} onClick={() => setActiveTab("dashboard")}>Dashboard</button>
                    <button className={activeTab === "products" ? "active" : ""} onClick={() => setActiveTab("products")}>Manage Products</button>
                    <button className={activeTab === "categories" ? "active" : ""} onClick={() => setActiveTab("categories")}>Categories</button>
                </nav>
                
                <div className="status-indicator">
                    <span style={{color: status.includes("LIVE") ? "#22c55e" : "#ef4444"}}>●</span>
                    {status}
                </div>
                
                <button className="sign-out-btn" onClick={() => {localStorage.clear(); window.location.reload();}}>Sign Out</button>
            </aside>

            <main className="admin-main">
                {successMsg && <div className="success-banner">{successMsg}</div>}
                
                <header style={{marginBottom: '3rem'}}>
                    <h2 style={{fontSize: '2rem', textTransform: 'capitalize'}}>{activeTab} <span>Overview</span></h2>
                </header>

                {activeTab === "dashboard" && (
                    <div className="dashboard-grid">
                        <div className="stat-card glass">
                            <span>Total Catalog</span>
                            <h4>{products.length} Products</h4>
                        </div>
                        <div className="stat-card glass">
                            <span>Active Segments</span>
                            <h4>{categories.length} Categories</h4>
                        </div>
                    </div>
                )}

                {activeTab === "categories" && (
                    <div className="categories-management-layout glass">
                        <h3 style={{marginBottom: '1.5rem'}}>Manage Categories</h3>
                        <form onSubmit={handleAddCategory} className="cat-add-form">
                            <input type="text" placeholder="Type new category name..." value={newCategory} onChange={e => setNewCategory(e.target.value)} />
                            <button type="submit">Add Category</button>
                        </form>
                        <div className="pro-cat-list">
                            {categories.map(c => (
                                <div key={c} className="pro-cat-item glass">
                                    <span>{c}</span>
                                    <button onClick={() => handleDeleteCategory(c)}>×</button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === "products" && (
                    <div className="products-management-layout">
                        <form className="management-form glass" onSubmit={handleSaveProduct}>
                            <h3 style={{marginBottom: '1rem'}}>{editingId ? "Edit Product" : "Add New Product"}</h3>
                            <input type="text" placeholder="Product Title" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
                            <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} required>
                                <option value="">Select Category</option>
                                {categories.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                            <input type="text" placeholder="Price (e.g. ₹500 or Ask for Quote)" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
                            <textarea placeholder="Product Description..." value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows="4" />
                            <div className="file-input-wrapper">
                                <label style={{fontSize: '0.8rem', color: '#888', marginBottom: '0.5rem', display: 'block'}}>Product Image</label>
                                <input type="file" accept="image/*" onChange={e => {
                                    const reader = new FileReader();
                                    reader.onloadend = () => setFormData({...formData, image: reader.result});
                                    if(e.target.files[0]) reader.readAsDataURL(e.target.files[0]);
                                }} />
                            </div>
                            <button type="submit" disabled={isLoading}>{isLoading ? "Processing..." : editingId ? "Update Product" : "Save to Database"}</button>
                            {editingId && <button type="button" style={{background: 'rgba(255,255,255,0.05)', marginTop: '0.5rem'}} onClick={() => {setEditingId(null); setFormData({title: "", category: "", description: "", price: "", image: ""});}}>Cancel Edit</button>}
                        </form>

                        <div className="management-list">
                            {products.length > 0 ? products.map(p => (
                                <div key={p._id} className="pro-admin-card glass">
                                    <img src={p.image || 'https://via.placeholder.com/300'} alt="" />
                                    <h3>{p.title}</h3>
                                    <p style={{fontSize: '0.85rem', color: '#888', marginBottom: '1rem'}}>{p.category}</p>
                                    <div className="actions">
                                        <button className="edit-btn" onClick={() => {setEditingId(p._id); setFormData(p); window.scrollTo({top: 0, behavior: 'smooth'});}}>Edit</button>
                                        <button className="delete-btn" onClick={() => handleDeleteProduct(p._id)}>Delete</button>
                                    </div>
                                </div>
                            )) : (
                                <div className="glass" style={{padding: '3rem', gridColumn: '1/-1', textAlign: 'center'}}>
                                    <p style={{color: '#888'}}>Your catalog is empty. Start adding products!</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default AdminPanel;
