import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import './Products.css';

// Importing generated images (using placeholder paths that I'll fix if I can get the exact paths or I'll just use the names)
// Since I know the names from generate_image, I'll use them.
// Note: In a real app, I'd move these to an assets folder, but I'll use them from the artifact dir for now or simulate.
import cardImg from '../../../assets/visiting-card.png'; // Fallback if AI images aren't moved
import posterImg from '../../../assets/posters.png';
import stickerImg from '../../../assets/stickers.png';
import bannerImg from '../../../assets/banners.png';

export const productsData = [
    { id: 1, title: "LED BORAD", category: "Sign Boards", description: "High visibility LED boards to make your brand shine.", price: "Custom Quote", image: bannerImg, whatsappMsg: "Hi Viral Print, I'm interested in LED BORAD. Can you provide more details?" },
    { id: 2, title: "OUTDOOR BRANDING", category: "Branding", description: "Effective outdoor branding solutions for maximum reach.", price: "Custom Quote", image: bannerImg, whatsappMsg: "Hi Viral Print, I'm interested in OUTDOOR BRANDING. Can you provide more details?" },
    { id: 3, title: "MS STANDEE", category: "Standees & Promo", description: "Durable MS standees for impactful promotions.", price: "Custom Quote", image: posterImg, whatsappMsg: "Hi Viral Print, I'm interested in MS STANDEE. Can you provide more details?" },
    { id: 4, title: "VINYL BRANDING", category: "Branding", description: "Premium vinyl branding for glass and solid surfaces.", price: "Custom Quote", image: stickerImg, whatsappMsg: "Hi Viral Print, I'm interested in VINYL BRANDING. Can you provide more details?" },
    { id: 5, title: "NEON BOARD", category: "Sign Boards", description: "Catchy and modern neon boards for your store or cafe.", price: "Custom Quote", image: bannerImg, whatsappMsg: "Hi Viral Print, I'm interested in NEON BOARD. Can you provide more details?" },
    { id: 6, title: "UV BACKLITE", category: "Printing", description: "Vibrant UV backlite printing for glow sign boxes.", price: "Custom Quote", image: bannerImg, whatsappMsg: "Hi Viral Print, I'm interested in UV BACKLITE. Can you provide more details?" },
    { id: 7, title: "GATE BRANDING", category: "Branding", description: "Grand gate branding structures for events and entrances.", price: "Custom Quote", image: bannerImg, whatsappMsg: "Hi Viral Print, I'm interested in GATE BRANDING. Can you provide more details?" },
    { id: 8, title: "CANVAS PRINTING", category: "Printing", description: "High-resolution canvas printing for premium artwork.", price: "Custom Quote", image: posterImg, whatsappMsg: "Hi Viral Print, I'm interested in CANVAS PRINTING. Can you provide more details?" },
    { id: 9, title: "CANVAS FRAMING", category: "Printing", description: "Elegant canvas framing services to complement your art.", price: "Custom Quote", image: posterImg, whatsappMsg: "Hi Viral Print, I'm interested in CANVAS FRAMING. Can you provide more details?" },
    { id: 10, title: "GLOW SIGN BOARD", category: "Sign Boards", description: "Bright and durable glow sign boards for 24/7 visibility.", price: "Custom Quote", image: bannerImg, whatsappMsg: "Hi Viral Print, I'm interested in GLOW SIGN BOARD. Can you provide more details?" },
    { id: 11, title: "FOAMSHEET CUTOUT", category: "Cutouts", description: "Custom-shaped foamsheet cutouts for displays and events.", price: "Custom Quote", image: posterImg, whatsappMsg: "Hi Viral Print, I'm interested in FOAMSHEET CUTOUT. Can you provide more details?" },
    { id: 12, title: "VINLY CUTTING STICKER", category: "Stickers", description: "Precision vinyl cutting stickers for cars, walls, and glass.", price: "Custom Quote", image: stickerImg, whatsappMsg: "Hi Viral Print, I'm interested in VINLY CUTTING STICKER. Can you provide more details?" },
    { id: 13, title: "WALLPAPER PRINTING", category: "Printing", description: "Customized wallpaper printing for interior decoration.", price: "Custom Quote", image: posterImg, whatsappMsg: "Hi Viral Print, I'm interested in WALLPAPER PRINTING. Can you provide more details?" },
    { id: 14, title: "SUNPACK SHEETS", category: "Printing", description: "Cost-effective sunpack sheet printing for local campaigns.", price: "Custom Quote", image: bannerImg, whatsappMsg: "Hi Viral Print, I'm interested in SUNPACK SHEETS. Can you provide more details?" },
    { id: 15, title: "ROLLUP STANDEE", category: "Standees & Promo", description: "Retractable roll-up standees, easy to carry and install.", price: "Custom Quote", image: posterImg, whatsappMsg: "Hi Viral Print, I'm interested in ROLLUP STANDEE. Can you provide more details?" },
    { id: 16, title: "WELCOME FOAMSHEET", category: "Cutouts", description: "Beautiful welcome foamsheets for weddings and events.", price: "Custom Quote", image: posterImg, whatsappMsg: "Hi Viral Print, I'm interested in WELCOME FOAMSHEET. Can you provide more details?" },
    { id: 17, title: "ACRYLIC NAME PLATES", category: "Sign Boards", description: "Premium acrylic name plates for homes and offices.", price: "Custom Quote", image: cardImg, whatsappMsg: "Hi Viral Print, I'm interested in ACRYLIC NAME PLATES. Can you provide more details?" },
    { id: 18, title: "LOLLYPOP GLOW SIGN BOX", category: "Sign Boards", description: "Double-sided lollypop sign boxes for pedestrian visibility.", price: "Custom Quote", image: bannerImg, whatsappMsg: "Hi Viral Print, I'm interested in LOLLYPOP GLOW SIGN BOX. Can you provide more details?" },
    { id: 19, title: "MEDICAL PLUS", category: "Sign Boards", description: "Illuminated medical plus signs for clinics and pharmacies.", price: "Custom Quote", image: bannerImg, whatsappMsg: "Hi Viral Print, I'm interested in MEDICAL PLUS. Can you provide more details?" },
    { id: 20, title: "BACKDROP BRANDING", category: "Branding", description: "Large scale backdrop setups for stages and press meets.", price: "Custom Quote", image: bannerImg, whatsappMsg: "Hi Viral Print, I'm interested in BACKDROP BRANDING. Can you provide more details?" },
    { id: 21, title: "PARKING STICKERS", category: "Stickers", description: "Reflective and normal parking stickers for societies.", price: "Custom Quote", image: stickerImg, whatsappMsg: "Hi Viral Print, I'm interested in PARKING STICKERS. Can you provide more details?" },
    { id: 22, title: "ONEWAY VISION BRANDING", category: "Branding", description: "See-through oneway vision films for glass facades.", price: "Custom Quote", image: stickerImg, whatsappMsg: "Hi Viral Print, I'm interested in ONEWAY VISION BRANDING. Can you provide more details?" },
    { id: 23, title: "CANOPY", category: "Standees & Promo", description: "Printed promotional canopies for outdoor activities.", price: "Custom Quote", image: bannerImg, whatsappMsg: "Hi Viral Print, I'm interested in CANOPY. Can you provide more details?" },
    { id: 24, title: "WOODEN STANDEE", category: "Standees & Promo", description: "Elegant wooden standees for cafes and premium stores.", price: "Custom Quote", image: posterImg, whatsappMsg: "Hi Viral Print, I'm interested in WOODEN STANDEE. Can you provide more details?" },
    { id: 25, title: "PROMO TABLE", category: "Standees & Promo", description: "Portable promo tables for exhibitions and product sampling.", price: "Custom Quote", image: posterImg, whatsappMsg: "Hi Viral Print, I'm interested in PROMO TABLE. Can you provide more details?" },
    { id: 26, title: "HORDING OUTDOOR ADVERISE", category: "Branding", description: "Massive outdoor hoardings for maximum brand visibility.", price: "Custom Quote", image: bannerImg, whatsappMsg: "Hi Viral Print, I'm interested in HORDING OUTDOOR ADVERISE. Can you provide more details?" },
    { id: 27, title: "POLL BOARD", category: "Sign Boards", description: "Street pole boards for local directional advertising.", price: "Custom Quote", image: bannerImg, whatsappMsg: "Hi Viral Print, I'm interested in POLL BOARD. Can you provide more details?" },
    { id: 28, title: "AUTO RIXA BRANDING", category: "Branding", description: "Auto rickshaw hood and back panel branding.", price: "Custom Quote", image: stickerImg, whatsappMsg: "Hi Viral Print, I'm interested in AUTO RIXA BRANDING. Can you provide more details?" }
];

export const defaultCategories = ["All", "Sign Boards", "Branding", "Standees & Promo", "Printing", "Stickers", "Cutouts"];

const Products = () => {
    const getInitialCategories = () => {
        const stored = localStorage.getItem("viralprint_categories");
        return stored ? JSON.parse(stored) : defaultCategories;
    };
    
    const [allCategories, setAllCategories] = useState(getInitialCategories);
    const [activeCategory, setActiveCategory] = useState("All");

    useEffect(() => {
        if (!localStorage.getItem("viralprint_categories")) {
            localStorage.setItem("viralprint_categories", JSON.stringify(defaultCategories));
        }
    }, []);

    const getInitialProducts = () => {
        const stored = localStorage.getItem("viralprint_products");
        if (stored) {
            return JSON.parse(stored);
        }
        return productsData;
    };

    const [allProducts, setAllProducts] = useState(getInitialProducts);
    const [filteredProducts, setFilteredProducts] = useState(allProducts);

    useEffect(() => {
        if (!localStorage.getItem("viralprint_products")) {
            localStorage.setItem("viralprint_products", JSON.stringify(productsData));
        }
    }, []);

    const containerRef = useRef(null);

    useEffect(() => {
        let ctx = gsap.context(() => {
            gsap.fromTo(".section-header", 
                { y: 50, opacity: 0 },
                {
                    scrollTrigger: {
                        trigger: ".products-section",
                        start: "top 80%",
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
                    },
                    y: 0,
                    opacity: 1,
                    scale: 1,
                    duration: 0.8,
                    stagger: 0.1,
                    ease: "back.out(1.2)"
                }
            );
        }, containerRef);
        return () => ctx.revert();
    }, []);

    useEffect(() => {
        const filtered = activeCategory === "All" 
            ? allProducts 
            : allProducts.filter(p => p.category === activeCategory);
        
        // GSAP transition for filtering
        gsap.to(".product-card", {
            opacity: 0,
            y: 20,
            scale: 0.95,
            duration: 0.3,
            stagger: 0.05,
            onComplete: () => {
                setFilteredProducts(filtered);
                gsap.to(".product-card", {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 0.5,
                    stagger: 0.1,
                    ease: "back.out(1.7)"
                });
            }
        });
    }, [activeCategory, allProducts]);

    const handleWhatsApp = (msg) => {
        const phone = "919875270319"; // Replace with real phone number
        const url = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
        window.open(url, '_blank');
    };

    return (
        <section className="products-section" id="products">
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

            <div className="products-grid" ref={containerRef}>
                {filteredProducts.map(product => (
                    <div className="product-card" key={product.id}>
                        <div className="product-img-wrap">
                            <img src={product.image} alt={product.title} />
                            <div className="product-badge">{product.category}</div>
                            <div className="product-overlay">
                                <button 
                                    className="whatsapp-btn"
                                    onClick={() => handleWhatsApp(product.whatsappMsg)}
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
                                <span className="product-price">{product.price}</span>
                                <button 
                                    className="footer-wa-btn"
                                    onClick={() => handleWhatsApp(product.whatsappMsg)}
                                >
                                    <svg viewBox="0 0 24 24" width="16" height="16">
                                        <path fill="currentColor" d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.814 9.814 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42 1.56 1.56 2.41 3.63 2.41 5.83 0 4.54-3.7 8.23-8.24 8.23-1.48 0-2.93-.39-4.19-1.15l-.3-.17-3.12.82.83-3.04-.19-.3a8.132 8.132 0 0 1-1.26-4.38c.01-4.54 3.7-8.24 8.24-8.24m-3.53 4.75c-.13-.27-.25-.28-.37-.28-.11 0-.25-.01-.39-.01-.14 0-.37.05-.56.27-.2.21-.75.73-.75 1.79 0 1.06.77 2.08.88 2.22.11.15 1.51 2.31 3.65 3.23.51.22.9.35 1.21.45.51.16.98.14 1.35.08.41-.06 1.26-.51 1.44-1.01.18-.5.18-.92.13-1.01-.05-.09-.17-.14-.36-.24-.19-.1-.13-.5-.73-.55-.12 0-.21.05-.33.15-.12.1-.25.22-.36.33-.11.11-.23.13-.42.03-.2-.1-.84-.31-1.6-1-0.59-.53-.98-1.18-1.1-1.37-.11-.19-.01-.3.09-.39s.2-.21.3-.32c.1-.11.13-.19.2-.32.06-.13.03-.25-.02-.36-.05-.11-.35-.86-.48-1.17z"/>
                                    </svg>
                                    WhatsApp
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Products;
