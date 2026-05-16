import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Hero.css';

import vid1 from '../../../assets/10476939-hd_1920_1080_25fps.mp4';
import vid2 from '../../../assets/12942886_1920_1080_30fps.mp4';
import vid3 from '../../../assets/15505103_1080_1920_60fps.mp4';
import vid4 from '../../../assets/15505140_1080_1920_60fps.mp4';

gsap.registerPlugin(ScrollTrigger);

/* ─── Story Data ──────────────────────────────────────── */
const SCENES = [
  {
    video: vid1,
    chapter: '01 — THE IDEA',
    lines: ['Your Brand,', 'Beautifully Printed.'],
    accent: 1,
    body: 'We transform raw concepts into print masterpieces that stop people mid-scroll.',
    cta: 'Start a Project',
    color: '#6366f1',
  },
  {
    video: vid2,
    chapter: '02 — THE CRAFT',
    lines: ['Precision In Every', 'Drop of Ink.'],
    accent: 1,
    body: 'State-of-the-art presses. Paper that speaks. Details no one else catches — but everyone feels.',
    cta: 'See Our Process',
    color: '#a855f7',
  },
  {
    video: vid3,
    chapter: '03 — THE IDENTITY',
    lines: ['A Brand', 'Without Limits.'],
    accent: 1,
    body: 'Bold colours. Premium finishes. Designs that walk into a room before you do.',
    cta: 'Explore Finishes',
    color: '#ec4899',
  },
  {
    video: vid4,
    chapter: '04 — THE LEGACY',
    lines: ['Print Like You', 'Mean Business.'],
    accent: 1,
    body: 'Join thousands of brands that chose quality over ordinary. Your story starts here.',
    cta: 'Get Started Now',
    color: '#f59e0b',
  },
];

/* ─── Component ───────────────────────────────────────── */
export default function Hero() {
  const wrapRef     = useRef(null);
  const stageRef    = useRef(null);
  const videoRefs   = useRef([]);
  const panelRefs   = useRef([]);
  const contentRefs = useRef([]);
  const dotRefs     = useRef([]);
  const progRef     = useRef(null);
  const numRef      = useRef(null);
  const orbRef      = useRef(null);

  const [currentIdx, setCurrentIdx] = React.useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    if (!wrapRef.current) return;

    const N = SCENES.length;

    // Set initial states
    SCENES.forEach((_, i) => {
      gsap.set(panelRefs.current[i], { opacity: i === 0 ? 1 : 0 });
      const c = contentRefs.current[i];
      if (!c) return;
      gsap.set(c.querySelectorAll('.hl'), { opacity: 0, y: 30, skewY: 5 });
      gsap.set(c.querySelector('.s-chapter'), { opacity: 0, y: -10 });
      gsap.set(c.querySelector('.s-body'), { opacity: 0, y: 15 });
      gsap.set(c.querySelector('.s-cta'), { opacity: 0, y: 10, scale: 0.95 });
    });

    const playScene = (idx) => {
      const scene = SCENES[idx];
      const panel = panelRefs.current[idx];
      const content = contentRefs.current[idx];

      // Video play
      videoRefs.current.forEach((v, i) => {
        if (!v) return;
        if (i === idx) v.play().catch(() => {});
        else v.pause();
      });

      const tl = gsap.timeline();
      
      // Crossfade
      panelRefs.current.forEach((p, i) => {
        if (i === idx) gsap.to(p, { opacity: 1, duration: 1.5 });
        else gsap.to(p, { opacity: 0, duration: 1.5 });
      });

      // Text In
      tl.to(content.querySelector('.s-chapter'), { opacity: 1, y: 0, duration: 0.6 })
        .to(content.querySelectorAll('.hl'), { opacity: 1, y: 0, skewY: 0, duration: 0.8, stagger: 0.1 }, 0.1)
        .to(content.querySelector('.s-body'), { opacity: 1, y: 0, duration: 0.7 }, 0.4)
        .to(content.querySelector('.s-cta'), { opacity: 1, y: 0, scale: 1, duration: 0.5 }, 0.55)
        .to(orbRef.current, { 
          background: `radial-gradient(circle, ${scene.color}44 0%, transparent 70%)`,
          duration: 1.2 
        }, 0);

      // HUD
      if (numRef.current) numRef.current.textContent = `0${idx + 1}`;
      if (progRef.current) gsap.to(progRef.current, { scaleX: (idx + 1) / N, duration: 0.5 });
      
      dotRefs.current.forEach((d, i) => {
        if (d) gsap.to(d, { 
          backgroundColor: i === idx ? '#fff' : 'rgba(255,255,255,0.2)',
          scale: i === idx ? 1.6 : 1,
          duration: 0.4
        });
      });
    };

    // Initial play
    playScene(0);

    // Auto Slide Timer
    timerRef.current = setInterval(() => {
      setCurrentIdx(prev => {
        const next = (prev + 1) % N;
        playScene(next);
        return next;
      });
    }, 6000); // 6 seconds per slide

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return (
    /* scroll spacer — gives page the scroll real-estate */
    <div ref={wrapRef} className="hero-scroll-wrap">
      {/* sticky viewport */}
      <div ref={stageRef} className="hero-stage">

        {/* ambient orb */}
        <div ref={orbRef} className="hero-orb" />
        {/* noise */}
        <div className="hero-noise" />

        {/* timeline dots */}
        <div className="timeline-dots">
          {SCENES.map((_, i) => (
            <div key={i} ref={el => (dotRefs.current[i] = el)} className="t-dot" />
          ))}
        </div>

        {/* scroll cue */}
        <div className="scroll-hint-wrap">
          <div className="sh-mouse"><div className="sh-wheel" /></div>
          <span className="sh-text">scroll</span>
        </div>

        {/* ── panels ── */}
        {SCENES.map((s, i) => (
          <div key={i} ref={el => (panelRefs.current[i] = el)} className="s-panel">
            {/* video */}
            <video
              ref={el => (videoRefs.current[i] = el)}
              className="s-video"
              src={s.video}
              muted
              loop
              playsInline
              preload="auto"
            />
            {/* vignette */}
            <div className="s-vignette" />
            {/* side accent */}
            <div className="s-side-line" style={{ background: s.color }} />

            {/* content */}
            <div ref={el => (contentRefs.current[i] = el)} className="s-content">
              <p className="s-chapter" style={{ color: s.color }}>{s.chapter}</p>

              <h1 className="s-headline">
                {s.lines.map((line, li) => (
                  <span key={li} className="hl-wrap">
                    <span
                      className={`hl ${li === s.accent ? 'hl--accent' : ''}`}
                      style={li === s.accent ? {
                        backgroundImage: `linear-gradient(135deg, ${s.color} 0%, #fff 100%)`,
                      } : {}}
                    >
                      {line}
                    </span>
                  </span>
                ))}
              </h1>

              <p className="s-body">{s.body}</p>

              <button
                className="s-cta"
                style={{ '--cta-col': s.color, boxShadow: `0 0 25px ${s.color}44` }}
              >
                {s.cta} <span className="s-cta-arrow">↗</span>
              </button>
            </div>

            {/* watermark */}
            <div className="s-watermark">0{i + 1}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
