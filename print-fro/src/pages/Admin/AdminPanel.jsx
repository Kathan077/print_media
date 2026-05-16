import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { defaultCategories } from '../../components/Home/Products/Products';
import './AdminPanel.css';

const ADMIN_CREDENTIALS = {
    phone: "9875270319",
    password: "viral@123"
};

const AdminPanel = () => {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        return localStorage.getItem("viralprint_admin_auth") === "true";
    });

    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [successMsg, setSuccessMsg] = useState("");

    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState(defaultCategories);
    const [newCategory, setNewCategory] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // Navigation
    const [activeTab, setActiveTab] = useState("dashboard");
    const [searchTerm, setSearchTerm] = useState("");
    
    // form state
    const [editingProduct, setEditingProduct] = useState(null);
    const [formData, setFormData] = useState({ id: null, title: "", category: "Sign Boards", description: "", price: "", image: "", whatsappMsg: "" });

    // Fetch Products
    const fetchProducts = async () => {
        setIsLoading(true);
        try {
            const res = await fetch(`${API_URL}/api/products`);
            const data = await res.json();
            if (data.success) setProducts(data.data);
        } catch (err) { console.error("Product Fetch Error:", err); }
        finally { setIsLoading(false); }
    };

    // Fetch Categories
    const fetchCategories = async () => {
        try {
            const res = await fetch(`${API_URL}/api/categories`);
            const data = await res.json();
            if (data.success && data.data.length > 0) {
                const dbCats = data.data.map(c => c.name);
                // Ensure default categories are always there
                const uniqueCats = [...new Set([...defaultCategories, ...dbCats])];
                setCategories(uniqueCats);
            } else {
                setCategories(defaultCategories);
            }
        } catch (err) { 
            console.error("Category Fetch Error:", err);
            setCategories(defaultCategories);
        }
    };

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);

    const handleLogin = (e) => {
        e.preventDefault();
        if (phone.trim() === ADMIN_CREDENTIALS.phone && password === ADMIN_CREDENTIALS.password) {
            localStorage.setItem("viralprint_admin_auth", "true");
            setIsAuthenticated(true);
            setError("");
        } else { setError("Invalid credentials"); }
    };

    const handleLogout = () => {
        localStorage.removeItem("viralprint_admin_auth");
        setIsAuthenticated(false);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        if(!formData.title) return;

        let generatedWhatsappMsg = formData.whatsappMsg || `Hi Viral Print, I'm interested in ${formData.title}.`;
        const finalFormData = { ...formData, whatsappMsg: generatedWhatsappMsg };
        
        setIsLoading(true);
        try {
            const method = editingProduct ? 'PUT' : 'POST';
            const endpoint = editingProduct ? `${API_URL}/api/products/${formData._id}` : `${API_URL}/api/products`;
            const res = await fetch(endpoint, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(finalFormData)
            });
            const data = await res.json();
            if (data.success) {
                setSuccessMsg(editingProduct ? "Product Updated!" : "Product Added!");
                fetchProducts();
                setEditingProduct(null);
                setFormData({ id: null, title: "", category: categories[0] || "Sign Boards", description: "", price: "", image: "", whatsappMsg: "" });
            } else {
                setError(data.message || "Failed to save product");
            }
        } catch (err) { setError("Network error"); }
        finally { setIsLoading(false); setTimeout(() => { setSuccessMsg(""); setError(""); }, 3000); }
    };

    const handleEdit = (p) => {
        setEditingProduct(true);
        setFormData(p);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        if(!window.confirm("Delete this product?")) return;
        try {
            const res = await fetch(`${API_URL}/api/products/${id}`, { method: 'DELETE' });
            const data = await res.json();
            if (data.success) {
                setSuccessMsg("Deleted!");
                fetchProducts();
            }
        } catch (err) { console.error(err); }
        finally { setTimeout(() => setSuccessMsg(""), 3000); }
    };

    // Database Categories
    const handleAddCategory = async (e) => {
        e.preventDefault();
        const trimmed = newCategory.trim();
        if(!trimmed) return;
        
        if (categories.includes(trimmed)) {
            setError("Category already exists");
            setTimeout(() => setError(""), 3000);
            return;
        }

        try {
            const res = await fetch(`${API_URL}/api/categories`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: trimmed })
            });
            const data = await res.json();
            if (data.success) {
                setSuccessMsg(`Category '${trimmed}' added!`);
                await fetchCategories();
                setNewCategory("");
            } else {
                setError(data.message || "Could not add category");
            }
        } catch (err) { setError("Category API Error"); }
        finally { setTimeout(() => { setSuccessMsg(""); setError(""); }, 3000); }
    };

    const handleDeleteCategory = async (catName) => {
        if(defaultCategories.includes(catName)) {
            setError("Cannot delete default categories");
            setTimeout(() => setError(""), 3000);
            return;
        }
        if(!window.confirm(`Delete '${catName}'?`)) return;

        try {
            const res = await fetch(`${API_URL}/api/categories/${catName}`, { method: 'DELETE' });
            const data = await res.json();
            if (data.success) {
                setSuccessMsg("Category deleted!");
                fetchCategories();
            }
        } catch (err) { console.error(err); }
        finally { setTimeout(() => setSuccessMsg(""), 3000); }
    };

    if (!isAuthenticated) {
        return (
            <div className="admin-login-container">
                <form className="admin-login-form" onSubmit={handleLogin}>
                    <div className="login-header">
                        <h2>Admin <span>Login</span></h2>
                    </div>
                    {error && <p className="error-msg">{error}</p>}
                    <div className="form-group">
                        <label>Mobile Number</label>
                        <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                    <button type="submit" className="pro-btn pro-btn--primary">Enter Dashboard</button>
                    <Link to="/" className="back-link">Back Home</Link>
                </form>
            </div>
        );
    }

    const filteredProducts = products.filter(p => 
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="admin-panel-layout">
            <aside className="admin-sidebar glass">
                <div className="sidebar-brand">
                    <div className="brand-icon">V</div>
                    <h3>VIRAL<span>ADMIN</span></h3>
                </div>
                <nav className="sidebar-nav">
                    <button className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>Dashboard</button>
                    <button className={`nav-item ${activeTab === 'products' ? 'active' : ''}`} onClick={() => setActiveTab('products')}>Products</button>
                    <button className={`nav-item ${activeTab === 'categories' ? 'active' : ''}`} onClick={() => setActiveTab('categories')}>Categories</button>
                </nav>
                <div className="sidebar-footer">
                    <Link to="/" className="view-site-link">View Site</Link>
                    <button onClick={handleLogout} className="logout-trigger">Sign Out</button>
                </div>
            </aside>

            <main className="admin-main">
                <header className="admin-top-bar">
                    <h2>{activeTab.toUpperCase()}</h2>
                </header>

                <div className="admin-scroll-area">
                    {successMsg && <div className="success-banner">{successMsg}</div>}
                    {error && <div className="success-banner" style={{background: '#ff4d4d'}}>{error}</div>}

                    {activeTab === 'dashboard' && (
                        <div className="dashboard-grid">
                            <div className="stat-card glass"><span>Products</span><h4>{products.length}</h4></div>
                            <div className="stat-card glass"><span>Categories</span><h4>{categories.length}</h4></div>
                        </div>
                    )}

                    {activeTab === 'products' && (
                        <div className="products-management-layout">
                            <div className="management-form glass">
                                <h3>{editingProduct ? "Update" : "Add"} Item</h3>
                                <form onSubmit={handleSave}>
                                    <div className="form-group"><label>Title</label><input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required /></div>
                                    <div className="form-group">
                                        <label>Category</label>
                                        <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                                            {categories.filter(c => c !== "All").map(c => (<option key={c} value={c}>{c}</option>))}
                                        </select>
                                    </div>
                                    <div className="form-group"><label>Description</label><textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} /></div>
                                    <div className="form-group">
                                        <label>Image</label>
                                        <input type="file" accept="image/*" onChange={(e) => {
                                            const file = e.target.files[0];
                                            if (file) {
                                                const reader = new FileReader();
                                                reader.onloadend = () => setFormData({...formData, image: reader.result});
                                                reader.readAsDataURL(file);
                                            }
                                        }} />
                                    </div>
                                    <button type="submit" className="pro-btn pro-btn--primary" disabled={isLoading}>
                                        {isLoading ? "Syncing..." : (editingProduct ? "Save Changes" : "Create Product")}
                                    </button>
                                </form>
                            </div>
                            <div className="management-list glass">
                                <div className="pro-admin-grid">
                                    {filteredProducts.map(p => (
                                        <div key={p._id} className="pro-admin-card">
                                            <div className="card-thumb">{p.image && <img src={p.image} alt="" />}</div>
                                            <h4>{p.title}</h4>
                                            <div className="card-ops">
                                                <button onClick={() => handleEdit(p)}>Edit</button>
                                                <button className="del" onClick={() => handleDelete(p._id)}>Delete</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'categories' && (
                        <div className="categories-management-layout glass">
                            <form className="cat-add-form" onSubmit={handleAddCategory}>
                                <input type="text" value={newCategory} onChange={e => setNewCategory(e.target.value)} placeholder="New Category Name" required />
                                <button type="submit" className="pro-btn pro-btn--primary">Add</button>
                            </form>
                            <div className="pro-cat-list">
                                {categories.map(c => (
                                    <div key={c} className="pro-cat-item glass">
                                        <span>{c}</span>
                                        {!defaultCategories.includes(c) && <button className="cat-remove" onClick={() => handleDeleteCategory(c)}>X</button>}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default AdminPanel;
