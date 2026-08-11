import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHome, FiUser, FiCode, FiBriefcase, FiAward, FiMail } from 'react-icons/fi';
import './Navbar.css';

const NAV_LINKS = [
  { href: '#hero', label: 'Home', icon: <FiHome /> },
  { href: '#about', label: 'About', icon: <FiUser /> },
  { href: '#skills', label: 'Skills', icon: <FiCode /> },
  { href: '#projects', label: 'Projects', icon: <FiBriefcase /> },
  { href: '#certificates', label: 'Certs', icon: <FiAward /> },
  { href: '#contact', label: 'Contact', icon: <FiMail /> },
];

const Navbar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState('hero');
  const [pillStyle, setPillStyle] = useState({});
  const navRef = useRef(null);

  const isAdminRoute = location.pathname.startsWith('/admin');

  // Scroll detection for header glass pill background
  useEffect(() => {
    if (isAdminRoute) return;
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [isAdminRoute]);

  // Active section detection via IntersectionObserver
  useEffect(() => {
    if (isAdminRoute) return;
    const sections = NAV_LINKS.map((l) => document.querySelector(l.href));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: '-40% 0px -55% 0px' }
    );
    sections.forEach((s) => s && observer.observe(s));
    return () => observer.disconnect();
  }, [isAdminRoute]);

  // Update sliding pill position for active nav item
  useEffect(() => {
    if (!navRef.current) return;
    const activeBtn = navRef.current.querySelector(`[data-active="true"]`);
    if (activeBtn) {
      setPillStyle({
        width: `${activeBtn.offsetWidth}px`,
        left: `${activeBtn.offsetLeft}px`,
      });
    }
  }, [active]);

  const close = () => setIsOpen(false);

  if (isAdminRoute) return null;

  return (
    <header className={`navbar-header ${scrolled ? 'scrolled' : ''}`}>
      <div className="container nav-container">
        {/* Floating Navbar Capsule */}
        <nav className="nav-capsule glass-morphism">
          {/* Logo Branding */}
          <Link to="/" className="nav-logo" onClick={close}>
            <div className="logo-emblem">
              <span className="logo-text">KK</span>
            </div>
            <div className="status-indicator" title="Available for Work">
              <span className="status-pulse" />
            </div>
          </Link>

          {/* Desktop Nav Buttons */}
          <ul className={`nav-menu ${isOpen ? 'open' : ''}`} ref={navRef}>
            {/* Active Pill Indicator */}
            <span className="nav-active-pill" style={pillStyle} />

            {NAV_LINKS.map(({ href, label, icon }) => {
              const id = href.slice(1);
              const isActive = active === id;
              return (
                <li key={href} className="nav-item">
                  <a
                    href={href}
                    data-active={isActive}
                    className={`nav-btn-link ${isActive ? 'active' : ''}`}
                    onClick={close}
                  >
                    <span className="nav-btn-icon">{icon}</span>
                    <span className="nav-btn-label">{label}</span>
                  </a>
                </li>
              );
            })}
          </ul>

          {/* Header Action Button (Let's Talk) */}
          <div className="nav-actions">
            <a href="#contact" className="nav-cta-btn">
              <span>Let's Talk</span>
            </a>

            {/* Mobile Hamburger Button */}
            <button
              className={`nav-toggle ${isOpen ? 'open' : ''}`}
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
