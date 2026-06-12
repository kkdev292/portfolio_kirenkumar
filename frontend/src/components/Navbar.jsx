import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const NAV_LINKS = [
  { href: '#hero', label: 'Home' },
  { href: '#about', label: 'About' },
  { href: '#skills', label: 'Skills' },
  { href: '#projects', label: 'Projects' },
  { href: '#certificates', label: 'Certs' },
  { href: '#contact', label: 'Contact' },
];

const Navbar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState('hero');
  const isAdminRoute = location.pathname.startsWith('/admin');

  // Scroll detection for glass effect
  useEffect(() => {
    if (isAdminRoute) return;
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [isAdminRoute]);

  // Active section detection via IntersectionObserver
  useEffect(() => {
    if (isAdminRoute) return;
    const sections = NAV_LINKS.map(l => document.querySelector(l.href));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: '-40% 0px -55% 0px' }
    );
    sections.forEach(s => s && observer.observe(s));
    return () => observer.disconnect();
  }, [isAdminRoute]);

  const close = () => setIsOpen(false);

  if (isAdminRoute) return null;

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="container nav-container">
        {/* Logo */}
        <Link to="/" className="nav-logo" onClick={close}>
          <span className="logo-bracket">&lt;</span>
          <span className="logo-text">KK</span>
          <span className="logo-bracket">/&gt;</span>
        </Link>

        {/* Desktop links */}
        <ul className={`nav-links ${isOpen ? 'open' : ''}`}>
          {NAV_LINKS.map(({ href, label }) => (
            <li key={href}>
              <a
                href={href}
                className={active === href.slice(1) ? 'nav-link active' : 'nav-link'}
                onClick={close}
              >
                {label}
                <span className="nav-link-indicator" />
              </a>
            </li>
          ))}
        </ul>

        {/* Hamburger */}
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
  );
};

export default Navbar;
