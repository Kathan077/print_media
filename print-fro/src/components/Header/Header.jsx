import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../../assets/logo_viral77.jpg.jpeg';
import './Header.css';

const NAV_LINKS = [
  { label: 'Home',     href: '/' },
  { label: 'About',    href: '/about' },
  { label: 'Gallery',  href: '/gallery' },
  { label: 'Services', href: '/services' },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrolled(window.scrollY > 30);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const close = () => setMenuOpen(false);

  return (
    <header className={`site-header${scrolled ? ' site-header--scrolled' : ''}`}>
      <div className="header-inner">

        {/* Logo */}
        <Link to="/" className="header-logo" onClick={close}>
          <img src={logo} alt="Viral Print" />
        </Link>

        {/* Desktop nav */}
        <nav className={`header-nav${menuOpen ? ' header-nav--open' : ''}`} aria-label="Main">
          <ul className="header-nav__list">
            {NAV_LINKS.map(({ label, href }) => {
              const isInternal = href.startsWith('/#');
              const isActive = location.pathname === href || (href === '/' && location.pathname === '/');
              
              if (isInternal && location.pathname === '/') {
                return (
                  <li key={label}>
                    <a href={href.replace('/', '')} className="header-nav__link" onClick={close}>{label}</a>
                  </li>
                );
              }

              return (
                <li key={label}>
                  <Link 
                    to={href} 
                    className={`header-nav__link ${isActive ? 'active' : ''}`} 
                    onClick={close}
                  >
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Mobile-only CTA inside drawer */}
          <div className="header-mobile-cta">
            <Link to="/quote" onClick={close}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.62a19.79 19.79 0 01-3.07-8.68A2 2 0 012 .84h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
              </svg>
              Get Quote
            </Link>
          </div>
        </nav>

        {/* Desktop CTA */}
        <Link to="/quote" className="header-cta" onClick={close}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.62a19.79 19.79 0 01-3.07-8.68A2 2 0 012 .84h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
          </svg>
          Get Quote
        </Link>

        {/* Hamburger */}
        <button
          className={`header-burger${menuOpen ? ' header-burger--open' : ''}`}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          onClick={() => setMenuOpen(o => !o)}
        >
          <span /><span /><span />
        </button>

      </div>
    </header>
  );
}
