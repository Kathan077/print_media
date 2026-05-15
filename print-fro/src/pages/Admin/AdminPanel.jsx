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
    
    // form state
    const [editingProduct, setEditingProduct] = useState(null);
    const [formData, setFormData] = useState({ id: null, title: "", category: "Sign Boards", description: "", price: "", image: "", whatsappMsg: "" });

    useEffect(() => {
        if (isAuthenticated) {
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
        }
    }, [isAuthenticated]);

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
                <form className="admin-login-form" onSubmit={handleLogin}>
                    <h2>Admin Login</h2>
                    {error && <p className="error-msg">{error}</p>}
                    <div className="form-group">
                        <label>Mobile Number</label>
                        <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                    <button type="submit" className="pro-btn pro-btn--primary">Login</button>
                    <Link to="/" style={{ display: 'block', textAlign: 'center', marginTop: '1rem', color: '#00F0FF', textDecoration: 'none' }}>Go back to website</Link>
                </form>
            </div>
        );
    }

    return (
        <div className="admin-panel-container">
            <header className="admin-header">
                <h2>Admin Panel - Products</h2>
                <div className="admin-nav-actions">
                    <Link to="/" className="pro-btn outline-btn" style={{marginRight: '1rem', textDecoration: 'none'}}>View Website</Link>
                    <button onClick={handleLogout} className="pro-btn outline-btn">Logout</button>
                </div>
            </header>

            <div className="admin-content">
                <div className="admin-form-section">
                    <h3>{editingProduct ? "Edit Product" : "Add New Product"}</h3>
                    {successMsg && <div style={{ color: '#00F0FF', marginBottom: '1rem', padding: '10px', background: 'rgba(0, 240, 255, 0.1)', borderRadius: '6px' }}>{successMsg}</div>}
                    <form onSubmit={handleSave}>
                        <div className="form-group">
                            <label>Product Title *</label>
                            <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required placeholder="e.g. 3D Letters Board"/>
                        </div>
                        <div className="form-group">
                            <label>Category *</label>
                            <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} required>
                                {categories.filter(c => c !== "All").map(c => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Description</label>
                            <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Premium quality display board..."></textarea>
                        </div>
                        <div className="form-group">
                            <label>Price Text</label>
                            <input type="text" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} placeholder="e.g. ₹999 or Custom Quote" />
                        </div>
                        <div className="form-group">
                            <label>Image URL or File (Optional)</label>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                <input type="text" value={formData.image || ""} onChange={e => setFormData({...formData, image: e.target.value})} placeholder="https://example.com/image.jpg"/>
                                <input type="file" accept="image/*" onChange={(e) => {
                                    const file = e.target.files[0];
                                    if (file) {
                                        const reader = new FileReader();
                                        reader.onloadend = () => {
                                            setFormData({...formData, image: reader.result});
                                        };
                                        reader.readAsDataURL(file);
                                    }
                                }} style={{ cursor: 'pointer', background: 'transparent', padding: '0', border: 'none' }} />
                                {formData.image && <img src={formData.image} alt="Preview" style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #1A2639' }} />}
                            </div>
                        </div>
                        <div className="form-group">
                            <label>WhatsApp Message (Auto-generated if empty)</label>
                            <input type="text" value={formData.whatsappMsg} onChange={e => setFormData({...formData, whatsappMsg: e.target.value})} placeholder="Hi Viral Print..." />
                        </div>
                        <div className="form-actions">
                            <button type="submit" className="pro-btn pro-btn--primary">{editingProduct ? "Update Product" : "Add Product"}</button>
                            {editingProduct && <button type="button" className="pro-btn outline-btn" onClick={() => {setEditingProduct(null); setFormData({ id: null, title: "", category: "Sign Boards", description: "", price: "", image: "", whatsappMsg: "" });}}>Cancel Edit</button>}
                        </div>
                    </form>
                </div>

                <div className="admin-list-section">
                    <h3>Existing Products ({products.length})</h3>
                    <div className="admin-products-list">
                        {products.map(p => (
                            <div key={p.id} className="admin-product-item">
                                <div className="p-base-info">
                                    <strong>{p.title}</strong>
                                    <span>{p.category}</span>
                                </div>
                                <div className="p-actions">
                                    <button className="edit-btn" onClick={() => handleEdit(p)}>Edit</button>
                                    <button className="delete-btn" onClick={() => handleDelete(p.id)}>Delete</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Category Management Section */}
            <div className="admin-category-section">
                <h3>Manage Categories ({categories.length})</h3>
                <div className="category-layout">
                    <form className="category-form" onSubmit={handleAddCategory}>
                        <div className="form-group">
                            <label>New Category Name</label>
                            <input type="text" value={newCategory} onChange={e => setNewCategory(e.target.value)} placeholder="e.g. T-Shirts" required />
                        </div>
                        <button type="submit" className="pro-btn pro-btn--primary">Add Category</button>
                    </form>
                    <div className="category-list">
                        {categories.map(c => (
                            <div key={c} className="cat-item">
                                <span>{c}</span>
                                {c !== "All" && (
                                    <button className="cat-delete-btn" onClick={() => handleDeleteCategory(c)}>X</button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminPanel;
