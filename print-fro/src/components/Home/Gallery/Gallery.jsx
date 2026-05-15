import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Gallery.css';

gsap.registerPlugin(ScrollTrigger);

const masonryItems = [
  { id: 1, img: "https://images.unsplash.com/photo-1620061213038-fbdcb085c88b?auto=format&fit=crop&q=80&w=800", title: "Premium Foil", category: "Packaging" },
  { id: 2, img: "https://images.unsplash.com/photo-1587595431973-160d0d94add1?auto=format&fit=crop&q=80&w=800", title: "Brand Identity", category: "Stationery" },
  { id: 3, img: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80&w=800", title: "Offset Mastery", category: "Commercial" },
  { id: 4, img: "https://images.unsplash.com/photo-1598520106830-8c45c2035460?auto=format&fit=crop&q=80&w=800", title: "Large Format", category: "Exhibition" },
];

const horizonItems = [
  { id: 1, img: "https://images.unsplash.com/photo-1616628188506-4b8cb6e0ba14?auto=format&fit=crop&q=80&w=1200", title: "UV Spot Coating" },
  { id: 2, img: "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&q=80&w=1200", title: "Embossed Luxe" },
  { id: 3, img: "https://images.unsplash.com/photo-1563298723-dcfebaa392e3?auto=format&fit=crop&q=80&w=1200", title: "Pantone Color Match" },
  { id: 4, img: "https://images.unsplash.com/photo-1541746972662-841f486d3b37?auto=format&fit=crop&q=80&w=1200", title: "Die-Cut Precision" }
];

const Gallery = () => {
  const containerRef = useRef(null);
  const spotlightRef = useRef(null);
  const horizonRef = useRef(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      // 1. Spotlight Hero Animation
      gsap.to(".gal-spotlight-img", {
        scrollTrigger: {
          trigger: ".gal-spotlight",
          start: "top bottom",
          end: "bottom top",
          scrub: true
        },
        scale: 1.3,
        y: 100,
      });

      // Reveal text
      gsap.fromTo(".spotlight-text span",
        { y: 150, opacity: 0 },
        {
          scrollTrigger: {
            trigger: ".gal-spotlight",
            start: "top 60%",
          },
          y: 0,
          opacity: 1,
          duration: 1.2,
          stagger: 0.1,
          ease: "expo.out"
        }
      );

      // 2. Masonry items reveal
      gsap.fromTo(".gal-item",
        { y: 100, opacity: 0, scale: 0.9 },
        {
          scrollTrigger: {
            trigger: ".gal-grid",
            start: "top 75%",
          },
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 1,
          stagger: 0.15,
          ease: "power3.out"
        }
      );

      // Masonry Parallax Columns
      if(window.innerWidth > 768) {
        gsap.to(".col-even", {
            scrollTrigger: {
                trigger: ".gal-grid",
                start: "top bottom",
                end: "bottom top",
                scrub: 1
            },
            y: -150,
            ease: "none"
        });
        
        gsap.to(".col-odd", {
            scrollTrigger: {
                trigger: ".gal-grid",
                start: "top bottom",
                end: "bottom top",
                scrub: 1
            },
            y: 80,
            ease: "none"
        });
      }

      // 3. Horizontal Scroll Pin Section
      if(window.innerWidth > 768) {
        const hItems = gsap.utils.toArray(".horizon-item");
        gsap.to(hItems, {
          xPercent: -100 * (hItems.length - 1),
          ease: "none",
          scrollTrigger: {
            trigger: ".gal-horizon-wrap",
            pin: true,
            scrub: 1,
            snap: 1 / (hItems.length - 1),
            end: () => "+=" + document.querySelector(".gal-horizon-wrap").offsetWidth * 2
          }
        });
      }

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="gallery-master" id="gallery" ref={containerRef}>
        
      {/* SECTION 1: THE SPOTLIGHT */}
      <section className="gal-spotlight" ref={spotlightRef}>
        <div className="spotlight-bg">
            <div className="spotlight-overlay"></div>
            <img 
                src="https://images.unsplash.com/photo-1541746972662-841f486d3b37?auto=format&fit=crop&q=80&w=2000" 
                alt="Studio" 
                className="gal-spotlight-img"
            />
        </div>
        <div className="spotlight-content container">
            <span className="spotlight-eyebrow">OUR PORTFOLIO</span>
            <h2 className="spotlight-text">
                <span className="outline">THE</span>
                <span>VAULT</span>
            </h2>
        </div>
      </section>

      {/* SECTION 2: THE MASONRY GRID */}
      <section className="gallery-section">
        <div className="container">
          <div className="gallery-header">
            <span className="gal-eyebrow">CURATED WORKS</span>
            <h2 className="gal-title">
              <span className="gal-title-line">A Showcase </span>
              <span className="gal-title-line outline">Of Pure Art</span>
            </h2>
            <p className="gal-desc">
              Explore our curated portfolio of premium printing. Where deep black inks meet the physical dimension.
            </p>
          </div>

          <div className="gal-grid">
            {masonryItems.map((item, index) => {
               const colClass = index % 2 === 0 ? "col-even" : "col-odd";
               return (
                <div key={item.id} className={`gal-item ${colClass}`}>
                  <div className="gal-image-wrapper">
                    <div className="gal-overlay"></div>
                    <img src={item.img} alt={item.title} className="gal-image" loading="lazy" />
                    
                    <div className="gal-info">
                      <span className="gal-category">{item.category}</span>
                      <h3 className="gal-item-title">{item.title}</h3>
                    </div>
                    
                    <div className="gal-view-btn">
                       <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                          <circle cx="12" cy="12" r="3"></circle>
                       </svg>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 3: HORIZONTAL SHOWCASE */}
      <section className="gal-horizon-wrap" ref={horizonRef}>
          <div className="horizon-header">
              <h3>Signature Finishes</h3>
              <p>Swipe through our masterclass printing techniques.</p>
          </div>
          <div className="horizon-container">
             {horizonItems.map((item) => (
                 <div key={item.id} className="horizon-item">
                     <div className="horizon-img-wrap">
                         <div className="horizon-overlay"></div>
                         <img src={item.img} alt={item.title} />
                         <h2 className="horizon-title">{item.title}</h2>
                     </div>
                 </div>
             ))}
          </div>
      </section>

    </div>
  );
};

export default Gallery;
