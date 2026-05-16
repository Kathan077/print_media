import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
        } else { setError("Invalid login"); }
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
            if ((await res.json()).success) {
                setSuccessMsg("Success!");
                fetchData();
                setFormData({ title: "", category: categories[0] || "", description: "", price: "", image: "" });
                setEditingId(null);
            }
        } catch (e) { setError("Save failed"); }
        finally { setIsLoading(false); setTimeout(() => {setSuccessMsg(""); setError("");}, 3000); }
    };

    const handleDeleteProduct = async (id) => {
        if (!window.confirm("Delete?")) return;
        await fetch(`${API_URL}/api/products/${id}`, { method: 'DELETE' });
        fetchData();
    };

    const handleAddCategory = async (e) => {
        e.preventDefault();
        if (!newCategory) return;
        const res = await fetch(`${API_URL}/api/categories`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: newCategory })
        });
        if ((await res.json()).success) {
            setNewCategory("");
            fetchData();
        } else { setError("Exists or Error"); setTimeout(()=>setError(""), 3000); }
    };

    const handleDeleteCategory = async (name) => {
        if (!window.confirm(`Delete ${name}?`)) return;
        await fetch(`${API_URL}/api/categories/${name}`, { method: 'DELETE' });
        fetchData();
    };

    if (!isAuthenticated) {
        return (
            <div className="admin-login-container">
                <form className="admin-login-form" onSubmit={handleLogin}>
                    <h2>Admin <span>Login</span></h2>
                    {error && <p style={{color: 'red'}}>{error}</p>}
                    <input type="text" placeholder="Phone" value={phone} onChange={e => setPhone(e.target.value)} />
                    <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
                    <button type="submit" className="pro-btn pro-btn--primary">Enter</button>
                </form>
            </div>
        );
    }

    return (
        <div className="admin-panel-layout">
            <aside className="admin-sidebar glass">
                <h3>VIRAL<span>ADMIN</span></h3>
                <nav className="sidebar-nav">
                    <button onClick={() => setActiveTab("dashboard")}>Dashboard</button>
                    <button onClick={() => setActiveTab("products")}>Products</button>
                    <button onClick={() => setActiveTab("categories")}>Categories</button>
                </nav>
                <div style={{marginTop: 'auto', padding: '1rem', fontSize: '0.8rem'}}>{status}</div>
                <button onClick={() => {localStorage.clear(); window.location.reload();}}>Sign Out</button>
            </aside>

            <main className="admin-main">
                {successMsg && <div className="success-banner">{successMsg}</div>}
                {error && <div className="success-banner" style={{background: 'red'}}>{error}</div>}

                {activeTab === "dashboard" && (
                    <div className="dashboard-grid">
                        <div className="stat-card glass">Products<h4>{products.length}</h4></div>
                        <div className="stat-card glass">Categories<h4>{categories.length}</h4></div>
                    </div>
                )}

                {activeTab === "categories" && (
                    <div className="categories-management-layout glass">
                        <form onSubmit={handleAddCategory} className="cat-add-form">
                            <input type="text" placeholder="New Category" value={newCategory} onChange={e => setNewCategory(e.target.value)} />
                            <button type="submit">Add</button>
                        </form>
                        <div className="pro-cat-list">
                            {categories.map(c => (
                                <div key={c} className="pro-cat-item glass">
                                    <span>{c}</span>
                                    <button onClick={() => handleDeleteCategory(c)}>X</button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === "products" && (
                    <div className="products-management-layout">
                        <form className="management-form glass" onSubmit={handleSaveProduct}>
                            <input type="text" placeholder="Title" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
                            <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} required>
                                <option value="">Select Category</option>
                                {categories.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                            <textarea placeholder="Description" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                            <input type="file" onChange={e => {
                                const reader = new FileReader();
                                reader.onloadend = () => setFormData({...formData, image: reader.result});
                                reader.readAsDataURL(e.target.files[0]);
                            }} />
                            <button type="submit" disabled={isLoading}>{isLoading ? "Wait..." : "Save Product"}</button>
                        </form>
                        <div className="management-list glass">
                            {products.map(p => (
                                <div key={p._id} className="pro-admin-card glass">
                                    {p.image && <img src={p.image} style={{width: '50px'}} alt="" />}
                                    <span>{p.title}</span>
                                    <button onClick={() => {setEditingId(p._id); setFormData(p);}}>Edit</button>
                                    <button onClick={() => handleDeleteProduct(p._id)}>Delete</button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default AdminPanel;
