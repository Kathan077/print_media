import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Principles.css';

gsap.registerPlugin(ScrollTrigger);

const principles = [
    {
        icon: "🏆",
        title: "Quality First",
        desc: "Print clear ho, color accurate ho. Paper quality sahi ho. Customer repeat order pakka.",
        accent: "#3b82f6"
    },
    {
        icon: "⏱️",
        title: "Deadline Pakki",
        desc: "Jo time bola hai usi time delivery de. Delay means customer loss. Urgent priority.",
        accent: "#818cf8"
    },
    {
        icon: "🎨",
        title: "Good Design",
        desc: "Design attractive hona chahiye. Canva / Photoshop expert focus. Design makes impact.",
        accent: "#ec4899"
    },
    {
        icon: "💬",
        title: "Communication",
        desc: "Size, Quantity, Design - clearly confirm kar. Last moment changes avoid hote hai.",
        accent: "#10b981"
    },
    {
        icon: "💰",
        title: "Trust Pricing",
        desc: "Hidden charges mat rakh. Transparent pricing builds long-term client trust.",
        accent: "#f59e0b"
    },
    {
        icon: "🔁",
        title: "Satisfaction",
        desc: "Mistake ho gayi to fix kar. Thoda loss le le par customer mat khona. Long-range profit.",
        accent: "#3b82f6"
    },
    {
        icon: "📦",
        title: "Safe Packing",
        desc: "Cards bend na ho, Posters fold na ho. Delivery me damage is zero tolerance.",
        accent: "#9ca3af"
    },
    {
        icon: "🚀",
        title: "Fast & Flexible",
        desc: "Urgent orders handle kar. Small quantity bhi accept kar. Stay ahead of competition.",
        accent: "#ef4444"
    }
];

const Principles = () => {
    const sectionRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(".pr-box-item", 
                { y: 40, opacity: 0, scale: 0.9 },
                {
                    scrollTrigger: {
                        trigger: ".pr-box-grid",
                        start: "top 80%",
                        toggleActions: "play none none reverse",
                    },
                    y: 0,
                    opacity: 1,
                    scale: 1,
                    duration: 1,
                    stagger: 0.1,
                    ease: "power2.out"
                }
            );

            gsap.fromTo(".pr-box-header h2", 
                { opacity: 0, x: -30 },
                {
                    scrollTrigger: {
                        trigger: ".pr-box-header",
                        start: "top 90%",
                    },
                    opacity: 1,
                    x: 0,
                    duration: 1,
                    ease: "power3.out"
                }
            );
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className="principles-box-v4" id="principles">
            <div className="pr-container">
                <div className="pr-box-header">
                    <span className="pr-box-tag">OUR VALUES</span>
                    <h2>OUR <span>GUIDING</span> PRINCIPLES</h2>
                </div>

                <div className="pr-box-grid">
                    {principles.map((pr, index) => (
                        <div key={index} className="pr-box-item" style={{ '--accent': pr.accent }}>
                            <div className="pr-box-inner">
                                <div className="pr-box-num">{(index + 1).toString().padStart(2, '0')}</div>
                                <div className="pr-box-icon">{pr.icon}</div>
                                <h3 className="pr-box-title">{pr.title}</h3>
                                <p className="pr-box-desc">{pr.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            
            {/* Background Blur */}
            <div className="pr-box-glow"></div>
        </section>
    );
};

export default Principles;
