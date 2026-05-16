import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Testimonials.css';

gsap.registerPlugin(ScrollTrigger);

const reviews = [
  {
    id: 1,
    name: "Varun Anand",
    role: "Google Review",
    text: "Excellent service.. Been associated with Viral Bhai for over 10 years. Exceptional quality and perfect delivery.",
    rating: 5
  },
  {
    id: 2,
    name: "Arrowsparks Digital",
    role: "Google Review",
    text: "Best services in entire Ahmedabad, I recommend Viral Print Media to all of you providing best services in Gujarat also.",
    rating: 5
  },
  {
    id: 3,
    name: "MRITUNJAY SINGH",
    role: "Google Review",
    text: "Timely service. Well behaved staff. Timely delivery.",
    rating: 5
  },
  {
    id: 4,
    name: "Kailash Rajput",
    role: "Google Review",
    text: "Best price.....Best service.......Best response.....Best location.....Best quality.....Everything is amazing 👌👌👌👌",
    rating: 5
  }
];

const Testimonials = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      // Header Animation
      gsap.fromTo(".testi-header-anim", 
        { y: 80, opacity: 0 },
        {
          scrollTrigger: {
            trigger: ".testimonials-wrap",
            start: "top 80%",
            fastScrollEnd: true,
          },
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.15,
          ease: "power3.out"
        }
      );

      // Card Stagger Animation
      gsap.fromTo(".testi-card", 
        { y: 100, opacity: 0, scale: 0.95 },
        {
          scrollTrigger: {
            trigger: ".testi-grid",
            start: "top 85%",
            fastScrollEnd: true,
            preventOverlaps: true,
          },
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 1,
          stagger: 0.15,
          ease: "expo.out"
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Generate 5 stars SVG for each review
  const renderStars = () => {
    return Array(5).fill(0).map((_, i) => (
      <svg key={i} className="star-icon" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    ));
  };

  return (
    <section className="testimonials-wrap" ref={sectionRef}>
      <div className="container">
        
        <div className="testimonials-header">
          <span className="testi-eyebrow testi-header-anim">CLIENT VOICES</span>
          <h2 className="testi-title testi-header-anim">
            TRUSTED BY <span className="outline">VISIONARIES</span>
          </h2>
          <p className="testi-desc testi-header-anim">
            Don't just take our word for it. Hear from the visionaries and brands who trust us to elevate their physical presence.
          </p>
        </div>

        <div className="testi-grid">
          {reviews.map((review) => (
            <div key={review.id} className="testi-card">
              <div className="testi-quote-mark">"</div>
              <div className="testi-stars">{renderStars()}</div>
              <p className="testi-text">{review.text}</p>
              
              <div className="testi-author">
                <div className="testi-avatar">
                   {review.name.charAt(0)}
                </div>
                <div className="testi-author-info">
                   <h4>{review.name}</h4>
                   <span>{review.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Testimonials;
