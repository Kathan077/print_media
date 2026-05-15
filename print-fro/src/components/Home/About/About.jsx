import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './About.css';
import mainImg from '../../../assets/printing-main.png';
import detailImg from '../../../assets/printing-detail.png';

gsap.registerPlugin(ScrollTrigger);

const About = () => {
    const sectionRef = useRef(null);
    const blobRef = useRef(null);
    const statsRef = useRef([]);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // 0. Initial State Sets (Pro fix for visibility)
            gsap.set([".label-text", ".ab-headline span", ".stat-item"], { 
                opacity: 0, 
                visibility: "visible" 
            });

            // 1. Text Reveal Animations
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 80%", // Trigger earlier
                    toggleActions: "play none none reverse"
                }
            });

            tl.to(".label-text", {
                opacity: 1,
                x: 0,
                duration: 1,
                stagger: 0.2,
                ease: "power2.out"
            });

            tl.to(".ab-headline span", {
                y: 0,
                rotateX: 0,
                opacity: 1,
                duration: 1.2,
                stagger: 0.1,
                ease: "expo.out"
            }, "-=0.8");

            tl.to(".stat-item", {
                opacity: 1,
                y: 0,
                duration: 1,
                stagger: 0.15,
                ease: "power3.out"
            }, "-=0.6");

            // 2. Number Counters
            statsRef.current.forEach((stat) => {
                const target = stat.getAttribute('data-target');
                const isPercent = target.includes('%');
                const num = parseFloat(target);
                
                gsap.fromTo(stat, 
                    { textContent: 0 },
                    { 
                        textContent: num,
                        duration: 2,
                        snap: { textContent: 1 },
                        scrollTrigger: {
                            trigger: stat,
                            start: "top 85%",
                        },
                        onUpdate: function() {
                            stat.textContent = Math.floor(this.targets()[0].textContent) + (isPercent ? '%' : '');
                        }
                    }
                );
            });

            // 3. Blob Floating Animation (Base)
            gsap.to(".ab-blob-1", {
                x: "random(-100, 100)",
                y: "random(-100, 100)",
                scale: "random(0.8, 1.2)",
                duration: 8,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut"
            });
            gsap.to(".ab-blob-2", {
                x: "random(-150, 150)",
                y: "random(-150, 150)",
                scale: "random(0.7, 1.1)",
                duration: 12,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut"
            });

            // 4. Mouse Interactive Parallax (Smoother)
            const handleMouseMove = (e) => {
                const { clientX, clientY } = e;
                const xPos = (clientX / window.innerWidth - 0.5) * 40; // Reduced intensity
                const yPos = (clientY / window.innerHeight - 0.5) * 40;

                gsap.to(".ab-blob-wrap", {
                    x: xPos,
                    y: yPos,
                    duration: 1.5,
                    ease: "sine.out"
                });
                
                // Content subtle reaction
                gsap.to(".ab-container", {
                    x: xPos * 0.1,
                    y: yPos * 0.1,
                    duration: 2,
                    ease: "sine.out"
                });
            };

            window.addEventListener('mousemove', handleMouseMove);
            return () => window.removeEventListener('mousemove', handleMouseMove);

        }, sectionRef);

        return () => ctx.revert();
    }, []);

    const addToStatsRef = (el) => {
        if (el && !statsRef.current.includes(el)) {
            statsRef.current.push(el);
        }
    };

    return (
        <section ref={sectionRef} className="about-v2-section" id="about">
            {/* Background Flair */}
            <div className="ab-bg-elements">
                <div className="ab-blob-wrap">
                    <div className="ab-blob ab-blob-1"></div>
                    <div className="ab-blob ab-blob-2"></div>
                </div>
                <div className="ab-noise"></div>
            </div>

            <div className="ab-container">
                {/* Top Row: Sidebar + Headline */}
                <div className="ab-top-row">
                    <div className="ab-sidebar-label">
                        <span className="label-text">WHO ARE WE</span>
                    </div>
                    <div className="ab-headline-wrap">
                        <h2 className="ab-headline">
                            <span>WE ARE</span> 
                            <span className="outlined">CREATIVE</span>
                            <span>STUDIO FROM INDIA</span>
                        </h2>
                    </div>
                </div>

                {/* Bottom Row: Sidebar + Stats */}
                <div className="ab-bottom-row">
                    <div className="ab-sidebar-text">
                        <p className="label-text">
                            OUR PRIMARY GOAL IS TO ACHIEVE YOUR COMPANY'S BUSINESS OBJECTIVES.
                        </p>
                    </div>
                    
                    <div className="ab-stats-grid">
                        <div className="stat-item">
                            <h3 className="stat-num" ref={addToStatsRef} data-target="7">7 YEARS</h3>
                            <p className="stat-desc">
                                THE PERIOD DURING WHICH WE HAVE BEEN SUCCESSFULLY PROMOTING BUSINESS IN INDIA AND AROUND THE WORLD
                            </p>
                        </div>
                        <div className="stat-item">
                            <h3 className="stat-num" ref={addToStatsRef} data-target="80%">80%</h3>
                            <p className="stat-desc">
                                THIS IS THE PERCENTAGE OF CLIENTS WHO RECEIVED UNPLANNED INCOME WORKING WITH US ON KPIS
                            </p>
                        </div>
                        <div className="stat-item">
                            <h3 className="stat-num" ref={addToStatsRef} data-target="40">40</h3>
                            <p className="stat-desc">
                                NUMBER OF AWARDS AND CERTIFICATES OF OUR MARKETING AGENCY
                            </p>
                        </div>
                        <div className="stat-item">
                            <h3 className="stat-num" ref={addToStatsRef} data-target="400">400</h3>
                            <p className="stat-desc">
                                PROJECTS THAT ACHIEVED THEIR EXPECTED RESULTS ACCORDING TO THE ANNUAL PLANS
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;
