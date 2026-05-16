import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productsData as defaultProducts, defaultCategories } from '../../components/Home/Products/Products';
import './AdminPanel.css';

const ADMIN_CREDENTIALS = {
    phone: "9875270319",
    password: "viral@123"
};

const AdminPanel = () => {
    // Check if logged in
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

    // Navigation
    const [activeTab, setActiveTab] = useState("dashboard");
    const [searchTerm, setSearchTerm] = useState("");
    
    // form state
    const [editingProduct, setEditingProduct] = useState(null);
    const [formData, setFormData] = useState({ id: null, title: "", category: "Sign Boards", description: "", price: "", image: "", whatsappMsg: "" });

    useEffect(() => {
        const stored = localStorage.getItem("viralprint_products");
        if (stored) {
            setProducts(JSON.parse(stored));
        } else {
            setProducts(defaultProducts);
            localStorage.setItem("viralprint_products", JSON.stringify(defaultProducts));
        }

        const storedCats = localStorage.getItem("viralprint_categories");
        if (storedCats) {
            setCategories(JSON.parse(storedCats));
        } else {
            setCategories(defaultCategories);
            localStorage.setItem("viralprint_categories", JSON.stringify(defaultCategories));
        }
    }, []);

    const handleLogin = (e) => {
        e.preventDefault();
        if (phone.trim() === ADMIN_CREDENTIALS.phone && password === ADMIN_CREDENTIALS.password) {
            localStorage.setItem("viralprint_admin_auth", "true");
            setIsAuthenticated(true);
            setError("");
        } else {
            setError("Invalid mobile number or password");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("viralprint_admin_auth");
        setIsAuthenticated(false);
    };

    // CRUD
    const handleSave = (e) => {
        e.preventDefault();
        
        if(!formData.title) return; // Basic validation

        let updatedProducts;
        let generatedWhatsappMsg = formData.whatsappMsg;
        
        if (!generatedWhatsappMsg) {
            generatedWhatsappMsg = `Hi Viral Print, I'm interested in ${formData.title}. Can you provide more details?`;
        }

        const finalFormData = { ...formData, whatsappMsg: generatedWhatsappMsg };

        if (editingProduct) {
            updatedProducts = products.map(p => p.id === formData.id ? finalFormData : p);
            setSuccessMsg("Product updated successfully!");
        } else {
            const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
            updatedProducts = [...products, { ...finalFormData, id: newId }];
            setSuccessMsg("New product added successfully!");
        }
        
        setProducts(updatedProducts);
        localStorage.setItem("viralprint_products", JSON.stringify(updatedProducts));
        setEditingProduct(null);
        setFormData({ id: null, title: "", category: "Sign Boards", description: "", price: "", image: "", whatsappMsg: "" });

        setTimeout(() => setSuccessMsg(""), 3000);
    };

    const handleEdit = (p) => {
        setEditingProduct(true);
        setFormData(p);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = (id) => {
        if(window.confirm("Are you sure you want to delete this product?")) {
            const updatedProducts = products.filter(p => p.id !== id);
            setProducts(updatedProducts);
            localStorage.setItem("viralprint_products", JSON.stringify(updatedProducts));
            setSuccessMsg("Product deleted!");
            setTimeout(() => setSuccessMsg(""), 3000);
        }
    };

    const handleAddCategory = (e) => {
        e.preventDefault();
        const trimmed = newCategory.trim();
        if(!trimmed) return;

        if(categories.some(c => c.toLowerCase() === trimmed.toLowerCase())) {
            setSuccessMsg("Category already exists!");
            setTimeout(() => setSuccessMsg(""), 3000);
            return;
        }

        const updatedCats = [...categories, trimmed];
        setCategories(updatedCats);
        localStorage.setItem("viralprint_categories", JSON.stringify(updatedCats));
        setNewCategory("");
        setSuccessMsg(`Category '${trimmed}' added!`);
        setTimeout(() => setSuccessMsg(""), 3000);
    };

    const handleDeleteCategory = (cat) => {
        if(cat === "All") {
            setSuccessMsg("Cannot delete 'All' category!");
            setTimeout(() => setSuccessMsg(""), 3000);
            return;
        }
        if(window.confirm(`Are you sure you want to delete category '${cat}'? Products using this may not filter properly.`)) {
            const updatedCats = categories.filter(c => c !== cat);
            setCategories(updatedCats);
            localStorage.setItem("viralprint_categories", JSON.stringify(updatedCats));
            setSuccessMsg("Category deleted!");
            setTimeout(() => setSuccessMsg(""), 3000);
        }
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
                        <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} required placeholder="9875XXXXXX" />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••" />
                    </div>
                    <button type="submit" className="pro-btn pro-btn--primary" style={{ width: '100%' }}>
                        Enter Dashboard
                    </button>
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
            
            {/* --- SIDEBAR --- */}
            <aside className="admin-sidebar glass">
                <div className="sidebar-brand">
                    <div className="brand-icon">V</div>
                    <h3>VIRAL<span>ADMIN</span></h3>
                </div>
                
                <nav className="sidebar-nav">
                    <button 
                        className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
                        onClick={() => setActiveTab('dashboard')}
                    >
                        <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
                        <span>Dashboard</span>
                    </button>
                    <button 
                        className={`nav-item ${activeTab === 'products' ? 'active' : ''}`}
                        onClick={() => setActiveTab('products')}
                    >
                        <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 8l-2-2H5L3 8v10a2 2 0 002 2h14a2 2 0 002-2V8z"></path><path d="M3 8h18"></path><path d="M10 12h4"></path></svg>
                        <span>Products</span>
                    </button>
                    <button 
                        className={`nav-item ${activeTab === 'categories' ? 'active' : ''}`}
                        onClick={() => setActiveTab('categories')}
                    >
                        <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"></path></svg>
                        <span>Categories</span>
                    </button>
                </nav>

                <div className="sidebar-footer">
                    <Link to="/" className="view-site-link">
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                        <span>Live Site</span>
                    </Link>
                    <button onClick={handleLogout} className="logout-trigger">
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                        <span>Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* --- MAIN CONTENT --- */}
            <main className="admin-main">
                <header className="admin-top-bar">
                    <div className="top-bar-left">
                        <h2>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h2>
                        <span className="breadcrumb">System / {activeTab}</span>
                    </div>
                    {activeTab === 'products' && (
                        <div className="top-bar-search">
                            <input 
                                type="text" 
                                placeholder="Search products..." 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
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
                                <div className="stat-chart" style={{ background: 'var(--cyan)' }} />
                            </div>
                            <div className="stat-card glass">
                                <span className="stat-label">Categories</span>
                                <span className="stat-value">{categories.length}</span>
                                <div className="stat-chart" style={{ background: 'var(--magenta)' }} />
                            </div>
                            <div className="stat-card glass">
                                <span className="stat-label">System Health</span>
                                <span className="stat-value">Optimal</span>
                                <div className="stat-chart" style={{ background: 'var(--yellow)' }} />
                            </div>

                            <div className="recent-activity glass">
                                <h3>System Info</h3>
                                <p>Welcome to the Viral Print Media Admin Pro. From here you can manage your digital catalog and update pricing in real-time.</p>
                                <button className="pro-btn pro-btn--primary" onClick={() => setActiveTab('products')}>
                                    Start Managing
                                </button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'products' && (
                        <div className="products-management-layout">
                            <div className="management-form glass">
                                <h3>{editingProduct ? "Update Item" : "Create New Item"}</h3>
                                <form onSubmit={handleSave}>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Title *</label>
                                            <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required placeholder="Product name"/>
                                        </div>
                                        <div className="form-group">
                                            <label>Category *</label>
                                            <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} required>
                                                {categories.filter(c => c !== "All").map(c => (
                                                    <option key={c} value={c}>{c}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label>Description</label>
                                        <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Describe product quality..."></textarea>
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Price Display</label>
                                            <input type="text" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} placeholder="e.g. ₹999 or Quote" />
                                        </div>
                                        <div className="form-group">
                                            <label>Thumbnail</label>
                                            <input type="file" accept="image/*" onChange={(e) => {
                                                const file = e.target.files[0];
                                                if (file) {
                                                    const reader = new FileReader();
                                                    reader.onloadend = () => setFormData({...formData, image: reader.result});
                                                    reader.readAsDataURL(file);
                                                }
                                            }} className="file-input" />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label>WhatsApp CTA Message</label>
                                        <input type="text" value={formData.whatsappMsg} onChange={e => setFormData({...formData, whatsappMsg: e.target.value})} placeholder="Default will be generated..." />
                                    </div>
                                    <div className="form-actions">
                                        <button type="submit" className="pro-btn pro-btn--primary">
                                            {editingProduct ? "Apply Changes" : "Create Product"}
                                        </button>
                                        {editingProduct && (
                                            <button type="button" className="pro-btn outline-btn" onClick={() => {
                                                setEditingProduct(null); 
                                                setFormData({ id: null, title: "", category: "Sign Boards", description: "", price: "", image: "", whatsappMsg: "" });
                                            }}>
                                                Cancel
                                            </button>
                                        )}
                                    </div>
                                </form>
                            </div>

                            <div className="management-list glass">
                                <h3>Catalog ({filteredProducts.length})</h3>
                                <div className="pro-admin-grid">
                                    {filteredProducts.map(p => (
                                        <div key={p.id} className="pro-admin-card">
                                            <div className="card-thumb">
                                                {p.image ? <img src={p.image} alt="" /> : <div className="no-img" />}
                                            </div>
                                            <div className="card-details">
                                                <h4>{p.title}</h4>
                                                <span>{p.category}</span>
                                            </div>
                                            <div className="card-ops">
                                                <button onClick={() => handleEdit(p)} title="Edit Product">
                                                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                                                    Edit
                                                </button>
                                                <button className="del" onClick={() => handleDelete(p.id)} title="Delete Product">
                                                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"></path></svg>
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'categories' && (
                        <div className="categories-management-layout glass">
                            <div className="cat-header">
                                <form className="cat-add-form" onSubmit={handleAddCategory}>
                                    <input 
                                        type="text" 
                                        value={newCategory} 
                                        onChange={e => setNewCategory(e.target.value)} 
                                        placeholder="New category name..." 
                                        required 
                                    />
                                    <button type="submit" className="pro-btn pro-btn--primary">Add</button>
                                </form>
                            </div>
                            <div className="pro-cat-list">
                                {categories.map(c => (
                                    <div key={c} className="pro-cat-item glass">
                                        <span className="cat-name">{c}</span>
                                        {c !== "All" && (
                                            <button className="cat-remove" onClick={() => handleDeleteCategory(c)}>Delete</button>
                                        )}
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
