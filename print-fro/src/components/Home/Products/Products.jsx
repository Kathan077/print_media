import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import './Products.css';

const Products = () => {
    const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/$/, "");
    
    const [allCategories, setAllCategories] = useState(["All"]);
    const [activeCategory, setActiveCategory] = useState("All");
    const [allProducts, setAllProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const sectionRef = useRef(null);

    // Fetch Everything from Database
    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [pRes, cRes] = await Promise.all([
                fetch(`${API_URL}/api/products`),
                fetch(`${API_URL}/api/categories`)
            ]);
            
            const pData = await pRes.json();
            const cData = await cRes.json();

            if (pData.success) {
                setAllProducts(pData.data);
                setFilteredProducts(pData.data);
            }

            if (cData.success) {
                const dbCats = cData.data.map(c => c.name);
                setAllCategories(["All", ...dbCats]);
            }
        } catch (err) {
            console.error("Fetch Error:", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        let ctx = gsap.context(() => {
            gsap.fromTo(".section-header", 
                { y: 50, opacity: 0 },
                {
                    scrollTrigger: {
                        trigger: ".products-section",
                        start: "top 80%",
                        fastScrollEnd: true,
                    },
                    y: 0,
                    opacity: 1,
                    duration: 1,
                    ease: "power3.out"
                }
            );

            gsap.fromTo(".product-card", 
                { y: 60, opacity: 0, scale: 0.9 },
                {
                    scrollTrigger: {
                        trigger: ".products-grid",
                        start: "top 80%",
                        fastScrollEnd: true,
                    },
                    y: 0,
                    opacity: 1,
                    scale: 1,
                    duration: 0.8,
                    stagger: 0.1,
                    ease: "back.out(1.2)"
                }
            );
        }, sectionRef);
        return () => ctx.revert();
    }, [allProducts]);

    useEffect(() => {
        const filtered = activeCategory === "All" 
            ? allProducts 
            : allProducts.filter(p => p.category === activeCategory);
        
        setFilteredProducts(filtered);
    }, [activeCategory, allProducts]);

    const handleWhatsApp = (msg) => {
        const phone = "919875270319";
        const url = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
        window.open(url, '_blank');
    };

    return (
        <section className="products-section" id="products" ref={sectionRef}>
            <div className="section-header">
                <span className="section-tag">OUR CATALOG</span>
                <h2 className="section-title">PREMIUM PRINTING <span>SOLUTIONS</span></h2>
                
                <div className="filter-bar">
                    {allCategories.map(cat => (
                        <button 
                            key={cat}
                            className={`filter-btn ${activeCategory === cat ? 'active' : ''}`}
                            onClick={() => setActiveCategory(cat)}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {isLoading ? (
                <div className="loading-state">
                    <p>Fetching latest products...</p>
                </div>
            ) : (
                <div className="products-grid">
                    {filteredProducts.length > 0 ? filteredProducts.map(product => (
                        <div className="product-card" key={product._id}>
                            <div className="product-img-wrap">
                                {product.image ? (
                                    <img src={product.image} alt={product.title} />
                                ) : (
                                    <div className="no-img-placeholder">NO IMAGE</div>
                                )}
                                <div className="product-badge">{product.category}</div>
                                <div className="product-overlay">
                                    <button 
                                        className="whatsapp-btn"
                                        onClick={() => handleWhatsApp(`Hi, I'm interested in ${product.title}`)}
                                    >
                                        <svg viewBox="0 0 24 24" width="20" height="20">
                                            <path fill="currentColor" d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.814 9.814 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42 1.56 1.56 2.41 3.63 2.41 5.83 0 4.54-3.7 8.23-8.24 8.23-1.48 0-2.93-.39-4.19-1.15l-.3-.17-3.12.82.83-3.04-.19-.3a8.132 8.132 0 0 1-1.26-4.38c.01-4.54 3.7-8.24 8.24-8.24m-3.53 4.75c-.13-.27-.25-.28-.37-.28-.11 0-.25-.01-.39-.01-.14 0-.37.05-.56.27-.2.21-.75.73-.75 1.79 0 1.06.77 2.08.88 2.22.11.15 1.51 2.31 3.65 3.23.51.22.9.35 1.21.45.51.16.98.14 1.35.08.41-.06 1.26-.51 1.44-1.01.18-.5.18-.92.13-1.01-.05-.09-.17-.14-.36-.24-.19-.1-.13-.5-.73-.55-.12 0-.21.05-.33.15-.12.1-.25.22-.36.33-.11.11-.23.13-.42.03-.2-.1-.84-.31-1.6-1-0.59-.53-.98-1.18-1.1-1.37-.11-.19-.01-.3.09-.39s.2-.21.3-.32c.1-.11.13-.19.2-.32.06-.13.03-.25-.02-.36-.05-.11-.35-.86-.48-1.17z"/>
                                        </svg>
                                        Order on WhatsApp
                                    </button>
                                </div>
                            </div>
                            <div className="product-info">
                                <h3 className="product-title">{product.title}</h3>
                                <p className="product-desc">{product.description}</p>
                                <div className="product-footer">
                                    <span className="product-price">{product.price || "Custom Quote"}</span>
                                    <button 
                                        className="footer-wa-btn"
                                        onClick={() => handleWhatsApp(`Hi, I'm interested in ${product.title}`)}
                                    >
                                        <svg viewBox="0 0 24 24" width="16" height="16">
                                            <path fill="currentColor" d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.814 9.814 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42 1.56 1.56 2.41 3.63 2.41 5.83 0 4.54-3.7 8.23-8.24 8.23-1.48 0-2.93-.39-4.19-1.15l-.3-.17-3.12.82.83-3.04-.19-.3a8.132 8.132 0 0 1-1.26-4.38c.01-4.54 3.7-8.24 8.24-8.24m-3.53 4.75c-.13-.27-.25-.28-.37-.28-.11 0-.25-.01-.39-.01-.14 0-.37.05-.56.27-.2.21-.75.73-.75 1.79 0 1.06.77 2.08.88 2.22.11.15 1.51 2.31 3.65 3.23.51.22.9.35 1.21.45.51.16.98.14 1.35.08.41-.06 1.26-.51 1.44-1.01.18-.5.18-.92.13-1.01-.05-.09-.17-.14-.36-.24-.19-.1-.13-.5-.73-.55-.12 0-.21.05-.33.15-.12.1-.25.22-.36.33-.11.11-.23.13-.42.03-.2-.1-.84-.31-1.6-1-0.59-.53-.98-1.18-1.1-1.37-.11-.19-.01-.3.09-.39s.2-.21.3-.32c.1-.11.13-.19.2-.32.06-.13.03-.25-.02-.36-.05-.11-.35-.86-.48-1.17z"/>
                                        </svg>
                                        WhatsApp
                                    </button>
                                </div>
                            </div>
                        </div>
                    )) : (
                        <div className="no-products">
                            <p>No products found in this category.</p>
                        </div>
                    )}
                </div>
            )}
        </section>
    );
};

export default Products;
