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
    const [categories, setCategories] = useState([]);
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
        } catch (err) { console.error(err); }
        finally { setIsLoading(false); }
    };

    // Fetch Categories
    const fetchCategories = async () => {
        try {
            const res = await fetch(`${API_URL}/api/categories`);
            const data = await res.json();
            if (data.success && data.data.length > 0) {
                setCategories(data.data.map(c => c.name));
            } else {
                setCategories(defaultCategories);
            }
        } catch (err) { 
            console.error(err);
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
                setSuccessMsg(editingProduct ? "Updated!" : "Added!");
                fetchProducts();
                setEditingProduct(null);
                setFormData({ id: null, title: "", category: categories[0] || "Sign Boards", description: "", price: "", image: "", whatsappMsg: "" });
            }
        } catch (err) { console.error(err); }
        finally { setIsLoading(false); setTimeout(() => setSuccessMsg(""), 3000); }
    };

    const handleDelete = async (id) => {
        if(!window.confirm("Delete this product?")) return;
        try {
            const res = await fetch(`${API_URL}/api/products/${id}`, { method: 'DELETE' });
            if ((await res.json()).success) {
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
        if(!trimmed || categories.includes(trimmed)) return;

        try {
            const res = await fetch(`${API_URL}/api/categories`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: trimmed })
            });
            if ((await res.json()).success) {
                setSuccessMsg(`Category added!`);
                fetchCategories();
                setNewCategory("");
            }
        } catch (err) { console.error(err); }
        finally { setTimeout(() => setSuccessMsg(""), 3000); }
    };

    const handleDeleteCategory = async (catName) => {
        if(catName === "All") return;
        if(!window.confirm(`Delete '${catName}'?`)) return;

        try {
            const res = await fetch(`${API_URL}/api/categories/${catName}`, { method: 'DELETE' });
            if ((await res.json()).success) {
                setSuccessMsg("Category deleted!");
                fetchCategories();
            }
        } catch (err) { console.error(err); }
        finally { setTimeout(() => setSuccessMsg(""), 3000); }
    };

    if (!isAuthenticated) {
        return (
            <div className="admin-login-container">
                <div className="mesh-gradient" />
                <form className="admin-login-form" onSubmit={handleLogin}>
                    <div className="login-header">
                        <span className="label-caps">SECURE ACCESS</span>
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
                    <Link to="/" className="back-link">Return to Home</Link>
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
            <div className="mesh-gradient" />
            
            <aside className="admin-sidebar glass">
                <div className="sidebar-brand">
                    <div className="brand-icon">V</div>
                    <h3>VIRAL<span>ADMIN</span></h3>
                </div>
                
                <nav className="sidebar-nav">
                    <button className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
                        <span>Dashboard</span>
                    </button>
                    <button className={`nav-item ${activeTab === 'products' ? 'active' : ''}`} onClick={() => setActiveTab('products')}>
                        <span>Products</span>
                    </button>
                    <button className={`nav-item ${activeTab === 'categories' ? 'active' : ''}`} onClick={() => setActiveTab('categories')}>
                        <span>Categories</span>
                    </button>
                </nav>

                <div className="sidebar-footer">
                    <Link to="/" className="view-site-link">Live Site</Link>
                    <button onClick={handleLogout} className="logout-trigger">Sign Out</button>
                </div>
            </aside>

            <main className="admin-main">
                <header className="admin-top-bar">
                    <div className="top-bar-left">
                        <h2>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h2>
                    </div>
                    {activeTab === 'products' && (
                        <div className="top-bar-search">
                            <input type="text" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                        </div>
                    )}
                </header>

                <div className="admin-scroll-area">
                    {successMsg && <div className="success-banner">{successMsg}</div>}

                    {activeTab === 'dashboard' && (
                        <div className="dashboard-grid">
                            <div className="stat-card glass">
                                <span className="stat-label">Total Products</span>
                                <span className="stat-value">{products.length}</span>
                            </div>
                            <div className="stat-card glass">
                                <span className="stat-label">Total Categories</span>
                                <span className="stat-value">{categories.length}</span>
                            </div>
                        </div>
                    )}

                    {activeTab === 'products' && (
                        <div className="products-management-layout">
                            <div className="management-form glass">
                                <h3>{editingProduct ? "Edit" : "Add"} Product</h3>
                                <form onSubmit={handleSave}>
                                    <div className="form-group">
                                        <label>Title</label>
                                        <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
                                    </div>
                                    <div className="form-group">
                                        <label>Category</label>
                                        <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                                            {categories.filter(c => c !== "All").map(c => (
                                                <option key={c} value={c}>{c}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>Description</label>
                                        <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                                    </div>
                                    <div className="form-group">
                                        <label>Image (File)</label>
                                        <input type="file" accept="image/*" onChange={(e) => {
                                            const file = e.target.files[0];
                                            if (file) {
                                                const reader = new FileReader();
                                                reader.onloadend = () => setFormData({...formData, image: reader.result});
                                                reader.readAsDataURL(file);
                                            }
                                        }} />
                                    </div>
                                    <button type="submit" className="pro-btn pro-btn--primary">{editingProduct ? "Update" : "Create"}</button>
                                </form>
                            </div>

                            <div className="management-list glass">
                                <div className="pro-admin-grid">
                                    {filteredProducts.map(p => (
                                        <div key={p._id} className="pro-admin-card">
                                            <div className="card-thumb">{p.image && <img src={p.image} alt="" />}</div>
                                            <h4>{p.title}</h4>
                                            <p>{p.category}</p>
                                            <div className="card-ops">
                                                <button onClick={() => handleEdit(p)}>Edit</button>
                                                <button className="del" onClick={() => handleDelete(p._id)}>Remove</button>
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
                                <input type="text" value={newCategory} onChange={e => setNewCategory(e.target.value)} placeholder="Category Name" required />
                                <button type="submit" className="pro-btn pro-btn--primary">Add</button>
                            </form>
                            <div className="pro-cat-list">
                                {categories.map(c => (
                                    <div key={c} className="pro-cat-item glass">
                                        <span>{c}</span>
                                        {c !== "All" && <button className="cat-remove" onClick={() => handleDeleteCategory(c)}>X</button>}
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
