import React, { useEffect, useRef } from 'react';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './ServicesPage.css';

gsap.registerPlugin(ScrollTrigger);

const servicesData = [
  {
    id: 'signage',
    number: '01',
    title: 'Sign Boards & Illuminated Displays',
    tag: 'Brightness Guaranteed',
    items: ['LED Boards', 'Neon Boards', 'Glow Sign Boards', 'Lollypop Glow Sign Box', 'Medical Plus', 'Acrylic Name Plates'],
    desc: 'High-visibility signage solutions including custom LED, Neon, and Glow signs to make your business shine day and night.'
  },
  {
    id: 'outdoor',
    number: '02',
    title: 'Outdoor Advertising & Branding',
    tag: 'Massive Reach',
    items: ['Outdoor Branding', 'Gate Branding', 'Hoarding Outdoor Advertise', 'Pole Boards', 'Auto Rixa Branding', 'Oneway Vision Branding'],
    desc: 'Take over the streets. From massive outdoor hoardings to mobile auto rickshaw branding, we maximize your brand\'s presence.'
  },
  {
    id: 'promotional',
    number: '03',
    title: 'Standees & Promotional Displays',
    tag: 'Event Ready',
    items: ['MS Standees', 'Rollup Standees', 'Wooden Standees', 'Promo Tables', 'Canopies', 'Backdrop Branding'],
    desc: 'Portable, premium, and impactful promotional structures perfectly crafted for exhibitions, corporate events, and active displays.'
  },
  {
    id: 'indoor',
    number: '04',
    title: 'Indoor & Specialized Printing',
    tag: 'Interior Elegance',
    items: ['Canvas Printing', 'Canvas Framing', 'Wallpaper Printing', 'UV Backlite', 'Sunpack Sheets'],
    desc: 'Transform interior spaces with high-end printing. Elegant canvases and custom wallpapers crafted with extremely vibrant colors.'
  },
  {
    id: 'stickers',
    number: '05',
    title: 'Stickers, Cutouts & Vinyls',
    tag: 'Precision Craft',
    items: ['Vinyl Branding', 'Foamsheet Cutouts', 'Vinyl Cutting Stickers', 'Welcome Foamsheets', 'Parking Stickers'],
    desc: 'Precision-cut stickers and intricate foam cutouts tailored for any surface, delivering crisp detailing and unmatched durability.'
  }
];

const finishesData = [
  { title: "Spot UV", icon: "✨", desc: "A high-gloss finish applied to specific areas to make logos or elements pop with a premium tactile feel." },
  { title: "Foil Stamping", icon: "🥇", desc: "Real metallic foil (Gold, Silver, Copper) pressed into the paper for absolute luxury and prestige." },
  { title: "Embossing", icon: "🌫️", desc: "Raising the surface of the paper to create a 3D effect that you can feel with your fingertips." },
  { title: "Velvet Touch", icon: "🦇", desc: "A specialized matte lamination that gives your prints a soft, luxurious, peach-like texture." }
];

export default function ServicesPage() {
  const pageRef = useRef(null);

  useEffect(() => {
    let ctx = gsap.context(() => {

      // Hero Title Animation
      gsap.fromTo('.svc-hero__title-word', 
        { y: 150, opacity: 0, rotateZ: 5 },
        { y: 0, opacity: 1, rotateZ: 0, duration: 1.2, stagger: 0.15, ease: 'power4.out', delay: 0.2 }
      );

      // Generic Reveal Up
      gsap.utils.toArray('.reveal-up').forEach((el) => {
        gsap.fromTo(el,
          { y: 60, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.2,
            ease: 'power3.out',
            scrollTrigger: {
               trigger: el,
               start: 'top 85%',
            }
          }
        );
      });

      // Stacked Cards Parallax / Scale Down effect
      const cards = gsap.utils.toArray('.stacked-card');
      cards.forEach((card, i) => {
        if (i !== cards.length - 1) {
          gsap.to(card, {
            scale: 0.92,
            opacity: 0.5,
            scrollTrigger: {
              trigger: card,
              start: "top 40px",
              end: "bottom 40px",
              scrub: true,
            }
          });
        }
      });

      // Parallax Printers
      gsap.fromTo('.printer-img', 
        { y: -50 },
        {
          y: 50,
          ease: "none",
          scrollTrigger: {
            trigger: ".svc-arsenal",
            scrub: true
          }
        }
      );

    }, pageRef);

    return () => ctx.revert();
  }, []);

  return (
    <main className="services-page" ref={pageRef}>
      <Header />

      {/* --- HERO SECTION --- */}
      <section className="svc-hero section">
        <div className="container">
          <span className="svc-hero__eyebrow">Expertise & Execution</span>
          <h1 className="svc-hero__title">
            <div className="svc-hero__title-line"><span className="svc-hero__title-word">PRINTING</span></div>
            <div className="svc-hero__title-line"><span className="svc-hero__title-word">BEYOND</span></div>
            <div className="svc-hero__title-line"><span className="svc-hero__title-word">LIMITS</span></div>
          </h1>
          <p className="svc-hero__subtitle reveal-up">
            From the crisp edge of a premium business card to the massive scale of event hoardings, we bring your digital vision into the physical world with absolute precision.
          </p>
        </div>
      </section>

      {/* --- VERTICAL STACKED CATEGORIES --- */}
      <section className="svc-stack-wrapper">
        <div className="container">
          <div className="stack-header reveal-up">
            <h2>MASTER SERVICES</h2>
            <p>Every print medium, executed with flawless precision.</p>
          </div>

          <div className="stack-container">
            {servicesData.map((data, index) => (
              <div 
                className="stacked-card" 
                key={data.id} 
                style={{ top: `calc(${index * 30}px + 100px)` }}
              >
                <div className="stacked-card-inner">
                  <div className="stack-left">
                     <span className="stack-number">{data.number}</span>
                     <span className="stack-tag">{data.tag}</span>
                     <h2 className="stack-title">{data.title}</h2>
                     <p className="stack-desc">{data.desc}</p>
                  </div>
                  <div className="stack-right">
                     <ul className="stack-list">
                        {data.items.map((item, i) => (
                          <li key={i}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="var(--cyan)" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
                            <span>{item}</span>
                          </li>
                        ))}
                     </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- PREMIUM FINISHES --- */}
      <section className="svc-finishes section">
        <div className="container">
          <h2 className="svc-section-title reveal-up">PREMIUM FINISHES</h2>
          <p className="svc-arsenal-desc reveal-up">
            The difference between ordinary and extraordinary lies in the finish. Elevate your prints from mere paper to absolute luxury with our specialized post-press techniques.
          </p>

          <div className="finishes-grid">
             {finishesData.map((finish, idx) => (
               <div className="finish-card reveal-up" key={idx}>
                 <div className="finish-icon">{finish.icon}</div>
                 <h3>{finish.title}</h3>
                 <p>{finish.desc}</p>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* --- OUR ARSENAL --- */}
      <section className="svc-arsenal section">
        <div className="container">
          <h2 className="svc-section-title reveal-up">THE ARSENAL</h2>
          <p className="svc-arsenal-desc reveal-up">
            World-class prints require world-class machines. Our facility is equipped with state-of-the-art heavy-duty offset and digital printers, guaranteeing perfect color reproduction, sharp typography, and rapid turnaround for bulk orders.
          </p>

          <div className="arsenal-grid reveal-up">
            <div className="arsenal-card">
              <div className="arsenal-image-box">
                 <div className="printer-img img-1"></div>
                 <div className="arsenal-overlay"></div>
              </div>
              <div className="arsenal-info">
                <h3>Heidelberg Offset Series</h3>
                <span>High-volume Commercial Printing</span>
              </div>
            </div>
            <div className="arsenal-card">
              <div className="arsenal-image-box">
                 <div className="printer-img img-2"></div>
                 <div className="arsenal-overlay"></div>
              </div>
              <div className="arsenal-info">
                <h3>HP Indigo Digital Press</h3>
                <span>Vibrant & Fast Premium Prints</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- CTA SECTION --- */}
      <section className="svc-cta section">
        <div className="container text-center">
           <h2 className="reveal-up">Ready to print excellence?</h2>
           <p className="reveal-up">Upload your designs or consult with our experts online today.</p>
           <div className="svc-cta-links reveal-up">
             <a href="https://wa.me/919875270319" className="pro-btn pro-btn--primary">Start WhatsApp Order</a>
           </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
