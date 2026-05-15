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
    lines: ['Your Brand,', 'Beautifully', 'Printed.'],
    accent: 2,
    body: 'We transform raw concepts into print masterpieces that stop people mid-scroll.',
    cta: 'Start a Project',
    color: '#6366f1',
  },
  {
    video: vid2,
    chapter: '02 — THE CRAFT',
    lines: ['Precision', 'In Every', 'Drop of Ink.'],
    accent: 0,
    body: 'State-of-the-art presses. Paper that speaks. Details no one else catches — but everyone feels.',
    cta: 'See Our Process',
    color: '#a855f7',
  },
  {
    video: vid3,
    chapter: '03 — THE IDENTITY',
    lines: ['A Brand', 'Without', 'Limits.'],
    accent: 1,
    body: 'Bold colours. Premium finishes. Designs that walk into a room before you do.',
    cta: 'Explore Finishes',
    color: '#ec4899',
  },
  {
    video: vid4,
    chapter: '04 — THE LEGACY',
    lines: ['Print Like', 'You Mean', 'Business.'],
    accent: 2,
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

  useEffect(() => {
    /* make sure all refs are mounted */
    if (!wrapRef.current) return;

    const VH = window.innerHeight;
    const N  = SCENES.length;

    /* ── start all videos (muted autoplay) ── */
    videoRefs.current.forEach((v, i) => {
      if (!v) return;
      v.muted   = true;
      v.loop    = true;
      v.playsInline = true;
      /* every video plays all the time — we change opacity instead */
      v.play().catch(() => {});
    });

    /* ── initial CSS states (no autoAlpha — just opacity + transform) ── */
    SCENES.forEach((_, i) => {
      /* panels: all visible but opacity 0 except first */
      gsap.set(panelRefs.current[i], { opacity: i === 0 ? 1 : 0 });

      /* content items hidden */
      const c = contentRefs.current[i];
      if (!c) return;
      gsap.set(c.querySelectorAll('.hl'), { opacity: 0, y: 60, skewY: 5 });
      gsap.set(c.querySelector('.s-chapter'), { opacity: 0, y: -14 });
      gsap.set(c.querySelector('.s-body'),    { opacity: 0, y: 22 });
      gsap.set(c.querySelector('.s-cta'),     { opacity: 0, y: 16, scale: 0.95 });
    });

    /* animate scene 0 content in immediately on load */
    const introC = contentRefs.current[0];
    if (introC) {
      gsap.timeline({ delay: 0.3 })
        .to(introC.querySelector('.s-chapter'), { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' })
        .to(introC.querySelectorAll('.hl'), {
          opacity: 1, y: 0, skewY: 0, duration: 1, stagger: 0.12, ease: 'expo.out',
        }, 0.1)
        .to(introC.querySelector('.s-body'), { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' }, 0.55)
        .to(introC.querySelector('.s-cta'),  { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'back.out(1.5)' }, 0.75);
    }

    /* ── PIN stage ── */
    ScrollTrigger.create({
      trigger: wrapRef.current,
      start: 'top top',
      end: `+=${(N - 1) * VH}`,
      pin: stageRef.current,
      pinSpacing: false,
      anticipatePin: 1,
    });

    /* ── Transitions between scenes ── */
    for (let i = 0; i < N - 1; i++) {
      const nextI = i + 1;
      const scene = SCENES[nextI];

      /* trigger point: scene i starts exiting, scene i+1 starts entering */
      ScrollTrigger.create({
        trigger: wrapRef.current,
        start: `+=${i * VH + VH * 0.6} top`,
        end:   `+=${nextI * VH} top`,
        scrub: 1.5,
        onEnter: () => {
          /* update HUD */
          if (numRef.current) numRef.current.textContent = `0${nextI + 1}`;
          if (progRef.current)
            gsap.to(progRef.current, { scaleX: (nextI + 1) / N, duration: 0.5, ease: 'power2.out' });
          /* orb colour */
          if (orbRef.current)
            gsap.to(orbRef.current, {
              background: `radial-gradient(circle, ${scene.color}44 0%, transparent 70%)`,
              duration: 0.7,
            });
          /* dots */
          dotRefs.current.forEach((d, di) =>
            gsap.to(d, {
              backgroundColor: di <= nextI ? '#fff' : 'rgba(255,255,255,0.2)',
              scale: di === nextI ? 1.6 : 1,
              duration: 0.3,
            })
          );
          /* animate next content in */
          const c = contentRefs.current[nextI];
          if (c) {
            gsap.timeline()
              .to(c.querySelector('.s-chapter'), { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' })
              .to(c.querySelectorAll('.hl'), {
                opacity: 1, y: 0, skewY: 0, duration: 0.9, stagger: 0.11, ease: 'expo.out',
              }, 0.08)
              .to(c.querySelector('.s-body'), { opacity: 1, y: 0, duration: 0.65, ease: 'power2.out' }, 0.4)
              .to(c.querySelector('.s-cta'),  { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'back.out(1.5)' }, 0.55);
          }
        },
        onEnterBack: () => {
          /* revert back to previous scene */
          if (numRef.current) numRef.current.textContent = `0${i + 1}`;
          if (progRef.current)
            gsap.to(progRef.current, { scaleX: (i + 1) / N, duration: 0.4 });
          if (orbRef.current)
            gsap.to(orbRef.current, {
              background: `radial-gradient(circle, ${SCENES[i].color}44 0%, transparent 70%)`,
              duration: 0.7,
            });
          dotRefs.current.forEach((d, di) =>
            gsap.to(d, {
              backgroundColor: di <= i ? '#fff' : 'rgba(255,255,255,0.2)',
              scale: di === i ? 1.6 : 1,
              duration: 0.3,
            })
          );
          /* reset next scene content */
          const c = contentRefs.current[nextI];
          if (c) {
            gsap.to(c.querySelectorAll('.hl'), { opacity: 0, y: 60, skewY: 5, duration: 0.3 });
            gsap.to([c.querySelector('.s-chapter'), c.querySelector('.s-body'), c.querySelector('.s-cta')], {
              opacity: 0, duration: 0.3,
            });
          }
        },
        /* panel crossfade driven by scrub */
        onUpdate: (self) => {
          gsap.set(panelRefs.current[i],     { opacity: 1 - self.progress });
          gsap.set(panelRefs.current[nextI], { opacity: self.progress });
        },
      });
    }

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
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
