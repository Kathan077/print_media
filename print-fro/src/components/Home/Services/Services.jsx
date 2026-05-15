import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Services.css';

import brandImg from '../../../assets/service-branding.png';
import offImg from '../../../assets/service-offset.png';

gsap.registerPlugin(ScrollTrigger);

const services = [
    {
        id: '01',
        title: 'Outdoor & Indoor Branding',
        desc: 'Comprehensive branding solutions for your business space. We transform environments into immersive brand experiences.',
        img: brandImg,
        tags: ['Outdoor', 'Indoor', 'Canopy']
    },
    {
        id: '02',
        title: 'All Type of Signages Work',
        desc: 'High-visibility signage solutions including LED, Neon, and Glow signs to make your business shine day and night.',
        img: offImg,
        tags: ['LED', 'Neon', 'Glow Signs']
    }
];

const Services = () => {
    const sectionRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Header Reveal
            gsap.from(".services-header > *", {
                y: 80,
                opacity: 0,
                duration: 1.5,
                stagger: 0.3,
                ease: "expo.out",
                scrollTrigger: {
                    trigger: ".services-header",
                    start: "top 80%"
                }
            });

            // Card Entrance (Staggered 3D)
            services.map((_, i) => {
                gsap.from(`.card-${i}`, {
                    y: 200,
                    opacity: 0,
                    scale: 0.95,
                    duration: 1.8,
                    ease: "power4.out",
                    scrollTrigger: {
                        trigger: `.card-${i}`,
                        start: "top 90%",
                        end: "top 70%",
                        scrub: 1
                    }
                });
            });

            // Float Animation for Glows
            gsap.to(".cmyk-glow", {
                x: "random(-100, 100)",
                y: "random(-100, 100)",
                duration: 20,
                repeat: -1,
                yoyo: true,
                ease: "none"
            });

        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className="services-section" id="services">
            <div className="cmyk-glow glow-cyan"></div>
            <div className="cmyk-glow glow-magenta"></div>
            
            <div className="services-container">
                <header className="services-header">
                    <span className="s-tag">EXCELLENCE IN PRINT</span>
                    <h2 className="s-title">Main<br/>Services</h2>
                </header>

                <div className="services-grid">
                    {services.map((item, index) => (
                        <div key={item.id} className={`service-card card-${index}`}>
                            <div className="card-inner">
                                <div className="card-img-wrap">
                                    <img src={item.img} alt={item.title} className="service-img" />
                                    <div className="card-overlay"></div>
                                </div>
                                
                                <div className="card-content">
                                    <span className="card-num">{item.id}</span>
                                    <h3 className="card-title">{item.title}</h3>
                                    <p className="card-desc">{item.desc}</p>
                                    <div className="card-tags">
                                        {item.tags.map(tag => <span key={tag} className="tag">{tag}</span>)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Services;
