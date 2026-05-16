import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import './AboutPage.css';

gsap.registerPlugin(ScrollTrigger);

const AboutPage = () => {
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero Animation
      gsap.from('.about-hero__title-line', {
        y: 200,
        opacity: 0,
        duration: 1.5,
        stagger: 0.2,
        ease: 'power4.out'
      });

      gsap.from('.about-hero__subtitle', {
        opacity: 0,
        y: 30,
        duration: 1,
        delay: 1,
        ease: 'power3.out'
      });

      // Section Reveals
      gsap.utils.toArray('.reveal-up').forEach((el) => {
        gsap.fromTo(el, 
          { y: 60, opacity: 0 },
          {
            scrollTrigger: {
              trigger: el,
              start: 'top 85%',
            },
            y: 0,
            opacity: 1,
            duration: 1.2,
            ease: 'power3.out'
          }
        );
      });

      // Process Items Stagger
      gsap.fromTo('.process-item', 
        { y: 40, opacity: 0 },
        {
          scrollTrigger: {
            trigger: '.process-grid',
            start: 'top 80%',
          },
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.2,
          ease: 'power2.out'
        }
      );

      // Parallax for huge type
      gsap.fromTo('.hero-bg-text', 
        { y: 0 },
        {
          scrollTrigger: {
            trigger: '.about-hero',
            start: 'top top',
            end: 'bottom top',
            scrub: true
          },
          y: -150
        }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="about-page">
      <Header />
      
      <main className="about-main">
        {/* --- MAGAZINE HERO --- */}
        <section className="about-hero">
          <div className="about-hero__content container">
            <span className="about-hero__eyebrow">ESTABLISHED MASTERMIND</span>
            <h1 className="about-hero__title">
              <span className="about-hero__title-line">Digital</span>
              <span className="about-hero__title-line text-outline">Anatomy</span>
              <span className="about-hero__title-line">Of Print</span>
            </h1>
            <p className="about-hero__subtitle">
              We decompose the art of printing into its purest elements: Precision, Material, and Impact.
            </p>
          </div>
        </section>

        {/* --- BRAND ESSENCE --- */}
        <section className="section about-essence">
          <div className="container">
            <h2 className="essence-statement reveal-up">
              We believe that <span className="dim">perfection is not an accident.</span> It is the result of <span className="dim">high intention,</span> sincere effort, and <span className="dim">intelligent execution.</span>
            </h2>
          </div>
        </section>

        {/* --- MASTER IMAGE --- */}
        <section className="about-image-strip">
          <div className="strip-container">
            <div className="gradient-divider"></div>
          </div>
        </section>

        <section className="section about-process">
          <div className="decor-circle decor-1"></div>
          <div className="decor-circle decor-2"></div>
          
          <div className="container">
            <h2 className="section-subtitle reveal-up">THE MASTER WORKFLOW</h2>
            <div className="process-grid">
              <div className="process-item">
                <span className="process-number">01</span>
                <h3>Deep Consultancy</h3>
                <p>We don't just take orders. We analyze your brand identity to recommend materials that resonate with your audience.</p>
              </div>
              <div className="process-item">
                <span className="process-number">02</span>
                <h3>Prototyping</h3>
                <p>Visualizing the physical. We create digital and physical proofs to ensure every line and fold is mathematically sound.</p>
              </div>
              <div className="process-item">
                <span className="process-number">03</span>
                <h3>High-Octane Print</h3>
                <p>Utilizing industrial-grade machinery that operates with micron-level accuracy to deliver unrivaled clarity.</p>
              </div>
              <div className="process-item">
                <span className="process-number">04</span>
                <h3>Precision Finish</h3>
                <p>The final touch. Foil stamping, UV coating, and custom die-cutting done by masters of the craft.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="section white-section about-mastery">
          <div className="container">
            <div className="mastery-content">
              <div className="mastery-text">
                <h2 className="reveal-up">Technology Meets <br /> craftsmanship.</h2>
                <p className="reveal-up">
                  Our arsenal includes the latest in offset and digital technologies. We treat our machines like instruments, tuned to produce perfectly synchronized visual symphonies.
                </p>
              </div>
              <div className="mastery-grid">
                <div className="mastery-card reveal-up">
                  <h4>Swiss Precision</h4>
                  <p>Equipped with high-precision cutting edges for surgically clean finishes on any substrate.</p>
                </div>
                <div className="mastery-card reveal-up">
                  <h4>Color Science</h4>
                  <p>Proprietary color-matching algorithms that bridge the gap between screen and paper.</p>
                </div>
                <div className="mastery-card reveal-up">
                  <h4>Tactile Depth</h4>
                  <p>Creating sensory experiences through textured inks and multi-layered embossing techniques.</p>
                </div>
                <div className="mastery-card reveal-up">
                  <h4>Global Standards</h4>
                  <p>Adhering to FSC and ISO standards to provide world-class quality with a conscience.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section about-specs">
          <div className="container">
            <div className="specs-grid">
              <div className="spec-item reveal-up">
                <span className="spec-label">Capacity</span>
                <span className="spec-value">1Million+ Impressions / Mo</span>
              </div>
              <div className="spec-item reveal-up">
                <span className="spec-label">Accuracy</span>
                <span className="spec-value">0.01mm Tolerance</span>
              </div>
              <div className="spec-item reveal-up">
                <span className="spec-label">Experience</span>
                <span className="spec-value">1588 Certified Projects</span>
              </div>
            </div>
          </div>
        </section>

        {/* --- FINAL CTA --- */}
        <section className="section about-final-cta">
          <div className="container">
            <span className="about-hero__eyebrow reveal-up">START THE DIALOGUE</span>
            <Link to="/quote" className="huge-link reveal-up">
              WORK WITH US <span className="arrow">→</span>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default AboutPage;
